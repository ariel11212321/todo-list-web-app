import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Sound files (You can replace these with your preferred audio files)
import addSound from './sounds/add.mp3';
import removeSound from './sounds/remove.mp3';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000; /* Black background */
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
`;

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

const TodoList = ({ todos, removeTodo }) => {
  const [newTodo, setNewTodo] = useState('');
  const [addSoundPlayed, setAddSoundPlayed] = useState(false);
  const [removeSoundPlayed, setRemoveSoundPlayed] = useState(false);
  
  const addAudioRef = React.createRef();
  const removeAudioRef = React.createRef();

  useEffect(() => {
    if (addSoundPlayed) {
      addAudioRef.current.play();
      setAddSoundPlayed(false);
    }
    if (removeSoundPlayed) {
      removeAudioRef.current.play();
      setRemoveSoundPlayed(false);
    }
  }, [addSoundPlayed, removeSoundPlayed]);

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setAddSoundPlayed(true);
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (index) => {
    setRemoveSoundPlayed(true);
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  return (
    <Container>
      <AppWrapper>
        <Title>Todo List</Title>
        <List>
          {todos.map((todo, index) => (
            <ListItem key={index} onClick={() => handleRemoveTodo(index)}>
              <TodoText>{todo}</TodoText>
              <RemoveButton>Remove</RemoveButton>
              <AudioControl ref={removeAudioRef} controls>
                <source src={removeSound} type="audio/mpeg" />
              </AudioControl>
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
        <AudioControl ref={addAudioRef} controls>
          <source src={addSound} type="audio/mpeg" />
        </AudioControl>
      </AppWrapper>
    </Container>
  );
};

export default TodoList;
