import React from 'react'
import { useSelector } from 'react-redux'
import { Card, ProgressBar } from 'react-bootstrap'

const Analytics = () => {
  const tasks = useSelector(state => state.schedule?.tasks || [])
  const goals = useSelector(state => state.goals?.goals || [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const totalGoals = goals.length
  const completedGoals = goals.filter(goal => goal.completed).length

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const goalCompletionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 0' }}>
      <Card className="mb-4 shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none' }}>
        <Card.Body>
          <h2 className="mb-4" style={{ fontWeight: 700, color: '#2d3748' }}>📊 Analytics</h2>

          {totalTasks === 0 && totalGoals === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096' }}>
              No data available yet.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Tasks</div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#3182ce', marginRight: 12 }}>{completedTasks}</span>
                  <span style={{ fontSize: '1.1rem', color: '#718096' }}>/ {totalTasks} completed</span>
                </div>
                <ProgressBar now={taskCompletionRate} label={`${taskCompletionRate}%`} style={{ height: 12, borderRadius: 8 }} variant="info" />
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Goals</div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#38a169', marginRight: 12 }}>{completedGoals}</span>
                  <span style={{ fontSize: '1.1rem', color: '#718096' }}>/ {totalGoals} completed</span>
                </div>
                <ProgressBar now={goalCompletionRate} label={`${goalCompletionRate}%`} style={{ height: 12, borderRadius: 8 }} variant="success" />
              </div>

              <div style={{ fontSize: '1rem', color: '#555', marginTop: 20, textAlign: 'center' }}>
                {taskCompletionRate === 100 && goalCompletionRate === 100
                  ? <>🎉 Amazing! You have completed all your tasks and goals. Keep up the great work!</>
                  : <>Keep going! You're making progress. Check your pending tasks and goals to stay on track.</>}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Analytics