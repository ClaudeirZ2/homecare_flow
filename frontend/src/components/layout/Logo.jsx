import logoIcone from '../../assets/logo-icone.png';
import logoCompleta from '../../assets/logo-completa.png';

// Logo oficial do Home Care Flow.
// variante="icone": coração + nome (barra superior); variante="completa": logo com slogan (login).
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
