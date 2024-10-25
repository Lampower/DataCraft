import './Header.css';
import logo from "../../assets/logo.svg";

const Header = () => {
 

  return (
    <div className="container">
      <div className="header-wrap">
        <ul className={"head-menu"}>
          <li>
            <img src={logo}/>
          </li>
          <li>
           <div className='name'>Конструктор отчетов</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
