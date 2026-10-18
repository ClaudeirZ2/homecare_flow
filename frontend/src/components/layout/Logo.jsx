import logoIcone from '../../assets/logo-icone.png';
import logoCompleta from '../../assets/logo-completa.png';

// Logo do Home Care Flow (recortada da arte original).
// variante="icone": coração + nome, para a barra do topo.
// variante="completa": logo inteira com o slogan, para a tela de login.
export default function Logo({ variante = 'icone', tamanho = 34 }) {
  if (variante === 'completa') {
    return <img src={logoCompleta} alt="Home Care Flow — Tecnologia e cuidado em harmonia" className="logo-completa" />;
  }

  return (
    <div className="marca">
      <img src={logoIcone} alt="" width={tamanho} height={tamanho} />
      <span className="marca-nome">HOME CARE <em>FLOW</em></span>
    </div>
  );
}
