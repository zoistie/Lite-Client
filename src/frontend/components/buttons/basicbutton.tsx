import React from 'react';
import styled from 'styled-components';

const BasicButton = () => {
  const handleClick = () => {
    console.log('Hello World');
  };

  return (
    <ButtonWrapper onClick={handleClick}>
      Click Me
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 30px;
  background-color: #4CAF50; /* Example color */
  color: white;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover {
    background-color: #45a049; /* Darker shade for hover effect */
  }
`;

export default BasicButton;
