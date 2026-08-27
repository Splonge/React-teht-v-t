export default function Row({ task, onDelete }) {
return (
<li>
{task.description}
<button className='delete-button' onClick={() =>
onDelete(task.id)}>Delete</button>
</li>
)
}
<ul>
{
tasks.map(task => (
<Row task={task} key={task.id} onDelete={deleteTask} />
))
}
</ul>