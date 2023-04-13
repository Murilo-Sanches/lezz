import React from 'react';
import { AiOutlineHome, AiOutlineMail } from 'react-icons/ai';
import { BsChatSquareText, BsGear, BsPeople } from 'react-icons/bs';

type IconProp = {
  icon: JSX.Element;
  text: string;
};

const iconsList: IconProp[] = [
  {
    icon: <AiOutlineHome />,
    text: 'Home',
  },
  {
    icon: <AiOutlineMail />,
    text: 'Solicitações',
  },
  {
    icon: <BsChatSquareText />,
    text: 'Direct',
  },
  {
    icon: <BsPeople />,
    text: 'Grupos',
  },
  {
    icon: <BsGear />,
    text: 'Configurações',
  },
];

export default iconsList;
