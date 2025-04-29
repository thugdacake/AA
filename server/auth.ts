import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { compare, hash } from 'bcrypt';
import { config } from './config';
import { db } from './db';
import { User, users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

const PostgresStore = connectPgSimple(session);

// Definição de tipos para a integração Discord
interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  guilds?: Array<{
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: number;
    features: string[];
  }>;
}

declare global {
  namespace Express {
    interface User extends User {}
  }
}

export function setupAuth(app: Express) {
  // Configurar sessão
  const sessionOptions: session.SessionOptions = {
    secret: config.auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PostgresStore({
      pool,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    cookie: {
      secure: !config.server.isDev,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    }
  };

  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  // Serializar/Deserializar usuário
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user || undefined);
    } catch (error) {
      done(error, undefined);
    }
  });

  // Estratégia Discord
  passport.use(
    new DiscordStrategy(
      {
        clientID: config.auth.discord.clientId,
        clientSecret: config.auth.discord.clientSecret,
        callbackURL: config.auth.discord.callbackUrl,
        scope: config.auth.discord.scopes,
      },
      async (accessToken, refreshToken, profile: DiscordProfile, done) => {
        try {
          // Procurar usuário pelo Discord ID
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.discordId, profile.id));

          if (existingUser) {
            // Atualizar informações do usuário
            const [updatedUser] = await db
              .update(users)
              .set({
                discordUsername: profile.username,
                avatar: profile.avatar 
                  ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}` 
                  : null,
                lastLogin: new Date(),
              })
              .where(eq(users.id, existingUser.id))
              .returning();

            return done(null, updatedUser);
          }

          // Criar novo usuário
          const [newUser] = await db
            .insert(users)
            .values({
              username: profile.username,
              discordId: profile.id,
              discordUsername: profile.username,
              avatar: profile.avatar 
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}` 
                : null,
              role: 'user',
              lastLogin: new Date(),
            })
            .returning();

          return done(null, newUser);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Estratégia Local
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (!user || !user.password) {
          return done(null, false, { message: 'Usuário não encontrado ou senha incorreta' });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Usuário não encontrado ou senha incorreta' });
        }

        // Atualizar último login
        await db
          .update(users)
          .set({ lastLogin: new Date() })
          .where(eq(users.id, user.id));

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    })
  );

  // Rotas de autenticação Discord
  app.get('/api/auth/discord', passport.authenticate('discord'));

  app.get(
    '/api/auth/discord/callback',
    passport.authenticate('discord', {
      successRedirect: '/',
      failureRedirect: '/auth?error=true',
    })
  );

  // Rotas de autenticação local
  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      // Verificar se o usuário já existe
      const { username, password } = req.body;
      
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      // Hash da senha
      const hashedPassword = await hash(password, 10);

      // Criar novo usuário
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          role: 'user',
          lastLogin: new Date(),
        })
        .returning();

      // Fazer login automático
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao fazer login' });
        }
        return res.json(newUser);
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    res.json(req.user);
  });

  // Helper de autorização
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.isAdmin = () => req.isAuthenticated() && req.user?.role === 'admin';
    req.isStaff = () => req.isAuthenticated() && ['admin', 'moderator', 'support'].includes(req.user?.role || '');
    next();
  });
}

// Middleware para rotas protegidas
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
}

// Middleware para rotas de administração
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
}

// Middleware para rotas de staff
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !['admin', 'moderator', 'support'].includes(req.user?.role || '')) {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
}

// Extensão das interfaces
declare global {
  namespace Express {
    interface Request {
      isAdmin: () => boolean;
      isStaff: () => boolean;
    }
  }
}