import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getTodosFromCookie, saveTodosToCookie } from './cookieHandler';

import remove from './sounds/remove.mp3';
import add from './sounds/add.mp3';
import Navbar from './Navbar' // Import the Navbar component

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #2e3192, #1b1464); /* Black background */
  min-height: 100vh;
  font-family: Arial, sans-serif;
  transition: background 0.3s ease-in-out;
  overflow: hidden; /* Prevent audio controls from appearing */
`;

const AppWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 20px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h1`
  color: #333;
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const zoomOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.5);
    opacity: 0;
  }
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding: 15px;
  transition: background-color 0.3s ease-in-out; /* Add transition for background color */
  position: relative; /* For audio controls */
  cursor: pointer;
  transform-origin: center;
  animation: ${rotate360} 0.5s linear;

  &:hover {
    background-color: #f0f0f0;
  }
}`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c0392b;
  }
`;

const TodoText = styled.span`
  color: #333;
  flex: 1;
  font-size: 18px;
  text-align: left;
`;

const AddContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const AddInput = styled.input`
  border: none;
  border-radius: 5px;
  font-size: 18px;
  padding: 10px;
  width: 70%;
`;

const AddButton = styled.button`
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  padding: 10px 20px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

const AudioControl = styled.audio`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0; /* Hide by default */
`;

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState(getTodosFromCookie());
  const [removeAnimation, setRemoveAnimation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [activeList, setActiveList] = useState(0); // Index of the active todo list
  const [todoLists, setTodoLists] = useState([
    { name: 'Todo List 1', todos: [] }, // Initial todo list
  ]);

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const addSound = () => {
    const audio = new Audio(add);
    audio.play();
  };

  const removeSound = () => {
    const audio = new Audio(remove);
    audio.play();
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addSound();
      const updatedTodos = [...todoLists[activeList].todos, newTodo];
      const updatedTodoLists = [...todoLists];
      updatedTodoLists[activeList].todos = updatedTodos;
      setTodoLists(updatedTodoLists);
      saveTodosToCookie(updatedTodoLists);
      setNewTodo('');
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a valid todo.'); // Set error message
    }
  };

  const handleAddList = (name) => {
    const newTodoList = { name: name, todos: [] };
    setTodoLists([...todoLists, newTodoList]);
    setActiveList(todoLists.length); // Set the active list to the newly created one
  };


  const handleRemoveTodo = (index) => {
    removeSound();
    const updatedTodos = [...todoLists[activeList].todos];
    updatedTodos.splice(index, 1);
    const updatedTodoLists = [...todoLists];
    updatedTodoLists[activeList].todos = updatedTodos;
    setTodoLists(updatedTodoLists);
    saveTodosToCookie(updatedTodoLists);

    // Trigger removal animation for the specific index
    setRemoveAnimation({ [index]: true });

    // After a delay, reset the removal animation for future removals
    setTimeout(() => {
      setRemoveAnimation({ [index]: false });
    }, 500); // Adjust the delay to match your animation duration
  };

  const deleteTodoList = (listIndex) => {
    if (todoLists.length === 1) {
      return;
    }
    if (listIndex >= 0 && listIndex < todoLists.length) {
      const updatedTodoLists = [...todoLists];
      updatedTodoLists.splice(listIndex, 1);
      setTodoLists(updatedTodoLists);
      saveTodosToCookie(updatedTodoLists);

      // Set active list to the first one if the active list is deleted
      if (activeList === listIndex) {
        setActiveList(0);
      } else if (activeList > listIndex) {
        setActiveList(activeList - 1); // Adjust the active list index
      }
    }
  };

  const renameTodoList = (listIndex, newName) => {
    if (listIndex >= 0 && listIndex < todoLists.length) {
      const updatedTodoLists = [...todoLists];
      updatedTodoLists[listIndex].name = newName;
      setTodoLists(updatedTodoLists);
      saveTodosToCookie(updatedTodoLists);
    }
  };

  return (
    <Container>
      <Title style={{ color: '#fff' }}>
        {todoLists.length > 0 ? todoLists[activeList].name : 'Todo List'}
      </Title>
       <Navbar
        todoLists={todoLists}
        activeList={activeList}
        setActiveList={setActiveList}
        addTodoList={handleAddList}
        deleteTodoList={deleteTodoList}
        renameTodoList={renameTodoList}
         // Pass the function to add a new list
      />
      <AppWrapper>
        <List>
          {todoLists[activeList].todos.map((todo, index) => (
            <ListItem
              key={index}
              className={removeAnimation[index] ? 'remove' : ''}
            >
              <TodoText>{todo}</TodoText>
              <RemoveButton onClick={() => handleRemoveTodo(index)}>
                Remove
              </RemoveButton>
            </ListItem>
          ))}
        </List>
        <AddContainer>
          <AddInput
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={handleInputChange}
          />
          <AddButton onClick={handleAddTodo}>Add</AddButton>
        </AddContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </AppWrapper>
    </Container>
  );
};

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
`;

export default App;
