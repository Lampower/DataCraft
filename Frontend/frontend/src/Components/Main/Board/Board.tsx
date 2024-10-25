import React, { useState } from 'react';
import Header from './Header/Header'; // Подключаем Header
import './Board.css';

const Board = ({ title, tasks, addTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  };

  return (
    <div className="board">
      <h3>{title}</h3>
      <div className="tasks">
        {tasks.map((task, index) => (
          <div className={`task ${task.status}`} key={index}>
            {task.text}
          </div>
        ))}
      </div>
      <div className="add-task">
        <input
          type="text"
          placeholder="Новая задача"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask} className="add-task-btn">+</button>
      </div>
    </div>
  );
};

const BoardContainer = () => {
  const [boardSpaces, setBoardSpaces] = useState([
    {
      name: 'Пространство 1',
      boards: [
        {
          title: 'Сделать',
          tasks: [],
        },
        {
          title: 'Переделать',
          tasks: [],
        },
        {
          title: 'В процессе',
          tasks: [],
        },
      ],
    },
  ]);

  const [currentSpaceIndex, setCurrentSpaceIndex] = useState(0);

  const switchBoardSpace = (index) => {
    setCurrentSpaceIndex(index);
  };

 
  const addNewBoard = () => {
    const newBoard = {
      title: `Новая доска ${boardSpaces[currentSpaceIndex].boards.length + 1}`,
      tasks: [],
    };
    const updatedSpaces = [...boardSpaces];
    updatedSpaces[currentSpaceIndex].boards.push(newBoard);
    setBoardSpaces(updatedSpaces);
  };


  const addNewSpace = () => {
    const newSpace = {
      name: `Пространство ${boardSpaces.length + 1}`,
      boards: [],
    };
    setBoardSpaces([...boardSpaces, newSpace]);
    setCurrentSpaceIndex(boardSpaces.length); 
  };

  return (
    <div className="board-container">
      <Header
        switchBoardSpace={switchBoardSpace}
        boardSpaces={boardSpaces}
        addNewSpace={addNewSpace} 
      />
      <div className='boards'>
        
        {boardSpaces[currentSpaceIndex].boards.map((board, index) => (
          <Board
            key={index}
            title={board.title}
            tasks={board.tasks}
            addTask={(taskText) => {
              const updatedSpaces = [...boardSpaces];
              updatedSpaces[currentSpaceIndex].boards[index].tasks.push({ text: taskText, status: 'todo' });
              setBoardSpaces(updatedSpaces);
            }}
          />
        ))}
        <div className="add-board">
          <button onClick={addNewBoard} className="add-board-btn">Добавить доску</button>
        </div>
        
      </div>
      
    </div>
  );
};

export default BoardContainer;
