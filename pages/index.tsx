import {v4 as uuidv4} from 'uuid';
import {useState} from "react";

const Button = ({name, className, handleClick}: { name: string, className?: string, handleClick: () => void }) => (
    <button
        className={`rounded-xl px-4 py-3 bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-300 ease-in-out ${className}`}
        onClick={handleClick}
    >
        {name}
    </button>
);

const Paper = ({children}: { children: any }) => (
    <div className={'mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-gray-100'}>
        {children}
    </div>
)

const TodoItem = ({children, handleClick}: { children: any, handleClick: () => void }) => (
    <div
        className={'bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition ease-in-out duration-400  hover:cursor-pointer select-none text-gray-800 dark:text-gray-100 w-full'}
        onClick={handleClick}
    >
        {children}
    </div>
);

const Card = ({className, children}: { className: string, children: any }) => (
    <div className={`p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900 ${className}`}>
        {children}
    </div>
)

interface TodoProps {
    id: string;
    name: string;
    checked: boolean;
}

export default function Home() {
    const [editMode, setEditMode] = useState<TodoProps | null>(null);
    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<TodoProps[]>([
        {
            id: uuidv4(),
            name: 'Visit the mall 🛍',
            checked: false,
        },
        {
            id: uuidv4(),
            name: 'Go water plant ☘️',
            checked: false,
        },
    ])

    const handleSetTodo = (todo: TodoProps): void => {
        let newTodos = [...todos].map(currentTodo => {
            if (currentTodo.id === todo.id) {
                currentTodo.checked = !currentTodo.checked;
            }

            return currentTodo;
        });

        setTodos(newTodos);
        setTodo('');
        setEditMode(null);
    }

    const handleAddNewOrEditTodo = (e): void => {
        if (e.keyCode === 13 && e.target.value.length) {
            setTodo('');

            if (editMode === null) {
                let newTodo: TodoProps = {
                    id: uuidv4(),
                    name: e.target.value,
                    checked: false,
                };

                setTodos([...todos, newTodo]);
            } else {
                setTodos(() => {
                    return [...todos].map(currentTodo => {
                        if (currentTodo.id === editMode?.id) {
                            currentTodo.name = e.target.value
                        }

                        return currentTodo;
                    });
                });

                setEditMode(null)
            }
        }
    }

    const handleClearCompletedTodo = (): void => {
        let newTodos = todos.filter(todo => !todo.checked);

        setTodos(() => newTodos)
    }

    const handleEditTodo = (todo: TodoProps): void => {
        setEditMode(todo);

        setTodo(todo.name);
    }

    const handleMarkAll = (): void => {
        setTodos(() => [...todos].map(todo => {
            todo.checked = true;
            return todo;
        }));
    }

    return (
        <div className={'bg-gray-100 h-screen dark:bg-gray-800'}>
            <div className={'max-w-xl mx-auto py-12'}>
                <Card className={'p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900'}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            My Awesome Todo
                        </h2>

                        {todos.filter(todo => !todo.checked).length ? (
                            <Button name={'Mark All Complete'} handleClick={handleMarkAll}/>
                        ) : null}
                    </div>

                    {todos.filter(todo => !todo.checked).length ? (
                        <div className={'mt-4 space-y-4'}>
                            {todos.filter(todo => !todo.checked).map((todo) => (
                                <div className={'flex items-center relative group'} key={todo.id}>
                                    <TodoItem handleClick={() => handleSetTodo(todo)}>
                                        <div>
                                            <input
                                                type="checkbox"
                                                className={'mr-3'}
                                                checked={todo?.checked}
                                                onChange={() => {
                                                }}
                                            />
                                            {todo.name}
                                        </div>
                                    </TodoItem>

                                    <span
                                        className={`group-hover:flex items-center justify-center absolute px-3 py-1 right-0 font-semibold text-sm text-red-700 bg-red-200 hover:bg-red-300 rounded-full hover:cursor-pointer mr-4 ${editMode?.id === todo.id ? 'flex' : 'hidden'}`}
                                        onClick={() => handleEditTodo(todo)}
                                    >
                                        {editMode?.id === todo.id ? 'Editing' : 'Edit'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Paper>
                            There are currently no active todo
                        </Paper>
                    )}

                    <div className={'mt-4'}>
                        <input
                            type="text"
                            placeholder={'Enter your new todo here'}
                            className={'w-full block w-full rounded-md bg-blue-50 border-transparent focus:border-blue-400 focus:bg-white focus:ring-0'}
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                            onKeyDown={handleAddNewOrEditTodo}
                        />
                    </div>
                </Card>

                <Card className={'p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900 mt-8'}>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Completed Todos
                    </h2>

                    {todos.filter(todo => todo.checked).length ? (
                        <>
                            <div className={'mt-4 space-y-4'}>
                                {todos.filter(todo => todo.checked).map((todo) => (
                                    <TodoItem key={todo.id} handleClick={() => handleSetTodo(todo)}>
                                        <input
                                            type="checkbox"
                                            className={'mr-3'}
                                            checked={todo?.checked}
                                            onChange={() => {
                                            }}
                                        />

                                        <del>{todo.name}</del>
                                    </TodoItem>
                                ))}
                            </div>

                            <div className={'mt-4'}>
                                <Button
                                    className={'w-full'}
                                    name={'Clear completed Todo'}
                                    handleClick={handleClearCompletedTodo}
                                />
                            </div>
                        </>
                    ) : (
                        <Paper>
                            There are currently no done todo
                        </Paper>
                    )}
                </Card>
            </div>
        </div>
    )
}