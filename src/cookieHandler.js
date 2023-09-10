// cookieHandler.js
import Cookies from 'js-cookie';

const COOKIE_NAME = 'todoList';

export const getTodosFromCookie = () => {
  const todosCookie = Cookies.get(COOKIE_NAME);
  return todosCookie ? JSON.parse(todosCookie) : [];
};

export const saveTodosToCookie = (todos) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(todos));
};
