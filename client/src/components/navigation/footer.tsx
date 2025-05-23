import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { fetchServerInfo } from "@/lib/auth";
import { useServerStats } from "@/hooks/use-server-stats";

const Footer: React.FC = () => {
  const { data: serverInfo } = useQuery({
    queryKey: ["/api/settings/public"],
    queryFn: fetchServerInfo,
  });

  // Utilizando nosso hook WebSocket para estatísticas em tempo real do servidor
  const [serverStatus, connected] = useServerStats();

  return (
    <footer className="bg-[#121212] border-t border-[#2D2D2D] py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="font-rajdhani font-bold text-2xl mb-4">
              <span className="text-white">TOKYO</span>
              <span className="text-[#00E5FF]">EDGE</span>
              <span className="text-[#FF0A54]">RP</span>
            </div>
            <p className="text-gray-400 mb-4">
              O servidor de roleplay brasileiro mais imersivo do FiveM. Uma experiência única de jogo em um mundo urbano repleto de crime e aventura.
            </p>
            <div className="flex space-x-4">
              <a href={serverInfo?.discordUrl || "https://discord.gg/NZAAaAmQtC"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5865F2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
              </a>
              <a href="https://instagram.com/tokyo_edge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@edge.tokyo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@TokyoEdge-RP" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                </svg>
              </a>
              <a href="https://twitter.com/edgeTokyorp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/"><span className="text-gray-400 hover:text-[#00E5FF]">Início</span></Link></li>
              <li><Link to="/news"><span className="text-gray-400 hover:text-[#00E5FF]">Notícias</span></Link></li>
              <li><a href="https://tokyo-edge-roleplay-store.tebex.io/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00E5FF]">Loja VIP</a></li>
              <li><Link to="/application"><span className="text-gray-400 hover:text-[#00E5FF]">Aplicar para Staff</span></Link></li>
              <li><Link to="/rules"><span className="text-gray-400 hover:text-[#00E5FF]">Regras do Servidor</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">Informações</h3>
            <ul className="space-y-2">
              <li><Link to="/faq"><span className="text-gray-400 hover:text-[#00E5FF]">FAQ</span></Link></li>
              <li><Link to="/terms"><span className="text-gray-400 hover:text-[#00E5FF]">Termos de Serviço</span></Link></li>
              <li><Link to="/privacy"><span className="text-gray-400 hover:text-[#00E5FF]">Política de Privacidade</span></Link></li>
              <li><Link to="/refund"><span className="text-gray-400 hover:text-[#00E5FF]">Política de Reembolso</span></Link></li>
              <li><Link to="/contact"><span className="text-gray-400 hover:text-[#00E5FF]">Contato</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">Status do Servidor</h3>
            <div className="glassmorphism p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className={`h-3 w-3 rounded-full ${serverStatus?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mr-2`}></div>
                <span className="text-white font-rajdhani font-medium">
                  {serverStatus?.online ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div className="text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Jogadores:</span>
                  <span className="text-white">{serverStatus?.players}/{serverStatus?.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Último restart:</span>
                  <span className="text-white">
                    {serverStatus?.lastRestart 
                      ? new Date(serverStatus.lastRestart).toLocaleTimeString('pt-BR') 
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ping:</span>
                  <span className="text-white">{serverStatus?.ping || 'N/A'}ms</span>
                </div>
              </div>
              <div className="mt-4">
                <a href={`${serverInfo?.connectionUrl || 'cfx.re/join/85e4q3'}`} target="_blank" rel="noopener noreferrer" className="cyberpunk-btn block w-full text-center bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black rounded-md py-2 font-medium">
                  Conectar
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#2D2D2D] pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Tokyo Edge RP. Todos os direitos reservados. Não afiliado à Rockstar Games.
            </p>
            <p className="text-gray-500 text-sm">
              Desenvolvido com <span className="text-[#FF0A54]">❤</span> pela equipe Tokyo Edge
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
