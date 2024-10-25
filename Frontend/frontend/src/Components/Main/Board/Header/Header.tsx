import './Header.css';
import { SetStateAction, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatar from "../../../../assets/avatar.svg";
import astolfo from "../../../../assets/astolfo.jpg";

const Header = ({ switchBoardSpace, boardSpaces, addNewSpace }) => {
  const [activePage, setActivePage] = useState("Главная");
  const location = useLocation();

  const handleMenuClick = (page: SetStateAction<string>) => {
    setActivePage(page);
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/index.html':
        setActivePage("Добавить доску");
        break;
      case '/projectinfo':
        setActivePage("по созданию");
        break;
      case '/contacts':
        setActivePage("участники проекта");
        break;
      default:
        setActivePage("Добавить доску");
    }
  }, [location.pathname]);

  return (
    <div className="container">
      <div className="header-wrap">
        <ul className={"head-menu"}>
          <li>
            <img src={avatar}/>
          </li>
          <li>
            <div className="boards-dropdown">
              <button className="boards-btn">Доски</button>
              <div className="dropdown-content">
                {boardSpaces.map((space, index) => (
                  <div key={index} onClick={() => switchBoardSpace(index)}>
                    {space.name}
                  </div>
                ))}
               
                <div className="add-space-btn" onClick={addNewSpace}>
                  Добавить пространство
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link to={`/projectinfo`} onClick={() => handleMenuClick("О проекте")}
              className={activePage === "по созданию" ? "active" : ""}>
              по созданию
            </Link>
          </li>
          <li>
            <Link to={`/contacts`} onClick={() => handleMenuClick("Контакты")}
              className={activePage === "участники проекта" ? "active" : ""}>
              участники проекта
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
