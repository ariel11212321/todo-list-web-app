import React, { useState } from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: purple; /* Change background color to purple */
  color: #fff;
  padding: 10px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh; /* Full height of the viewport */
  display: flex;
  flex-direction: column; /* Make it vertical */
  align-items: flex-end; /* Align items to the right */
  justify-content: flex-start; /* Align items to the top */
`;

const NavItem = styled.div`
  cursor: pointer;
  margin: 10px 0;
  ${(props) =>
    props.active &&
    `
    font-weight: bold;
    text-decoration: underline;
  `}
`;

const AddListButton = styled.button`
  background-color: #007bff;
  border: none;
  border-radius: 50%; /* Make it circular */
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const DeleteListButton = styled.button`
  background-color: red; /* Change the delete button color */
  border: none;
  border-radius: 50%; /* Make it circular */
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const Navbar = ({
  todoLists,
  activeList,
  setActiveList,
  addTodoList,
  deleteTodoList,
  renameTodoList,
}) => {
  const [newListName, setNewListName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setNewListName(e.target.value);
  };

  const handleAddList = () => {
    if (newListName.trim() !== '') {
      addTodoList(newListName);
      setNewListName('');
    }
  };

  const handleDeleteList = () => {
    deleteTodoList(activeList);
  };

  const handleRenameList = () => {
    if (newListName.trim() !== '') {
      renameTodoList(activeList, newListName);
      setIsEditing(false);
    }
  };

  return (
    <NavbarContainer>
      {todoLists.map((list, index) => (
        <NavItem
          key={index}
          active={index === activeList}
          onClick={() => setActiveList(index)}
          onDoubleClick={() => setIsEditing(true)} // Double click to edit the name
        >
          {isEditing && index === activeList ? (
            <div>
              <input
                type="text"
                value={newListName}
                onChange={handleInputChange}
              />
              <button onClick={handleRenameList}>Rename</button>
            </div>
          ) : (
            <span>{list.name}</span>
          )}
        </NavItem>
      ))}
      <AddListButton onClick={handleAddList}>+</AddListButton>
      {todoLists.length > 1 && (
        <DeleteListButton onClick={handleDeleteList}>-</DeleteListButton>
      )}
      <input
        type="text"
        placeholder="New List Name"
        value={newListName}
        onChange={handleInputChange}
      />
    </NavbarContainer>
  );
};

export default Navbar;
