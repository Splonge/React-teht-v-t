import './App.css'
import { useState, useEffect } from 'react'
import { useUser } from './context/useUser'
import axios from 'axios'
import Row from './components/Row'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  useEffect(() => {
    axios.get(`${apiUrl}/tasks`)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }, [])

  const addTask = (e) => {
    e.preventDefault()

    const headers = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    const newTask = {
      description: task
    }

    axios.post(
      `${apiUrl}/tasks`,
      { task: newTask },
      headers
    )
      .then(response => {
        setTasks(currentTasks => [...currentTasks, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }

  const deleteTask = (deleted) => {
    const headers = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    axios.delete(`${apiUrl}/tasks/${deleted}`, headers)
      .then(() => {
        setTasks(currentTasks =>
          currentTasks.filter(item => item.id !== deleted)
        )
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }

  return (
    <div id="container">
      <h3>Todos</h3>

      <form onSubmit={addTask}>
        <input
          placeholder="Add new task"
          value={task}
          onChange={event => setTask(event.target.value)}
        />
      </form>

      <ul>
        {tasks.map(item => (
          <Row
            key={item.id}
            task={item}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  )
}

export default App