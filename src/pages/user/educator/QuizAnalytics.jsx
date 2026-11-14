const results = [
  { id: 1, student: "Student 1", score: 8, total: 10 },
  { id: 2, student: "Student 2", score: 7, total: 10 },
  { id: 3, student: "Student 3", score: 9, total: 10 },
];
const totalAttempts = results.length;
let sum = 0;
results.forEach((result) => {
     sum = sum + result.score;
})
let average = sum / totalAttempts;
const averageScore = totalAttempts === 0 ? 0 : average

function QuizAnalytics() {
  return (
    <main className="container py-5">
      <h1>Quiz Analytics</h1>
      <p>Review student performance and quiz results.</p>
      <div className="d-flex gap-3 mb-4">
        <div className="review-card">
          <h2>{totalAttempts}</h2>
          <p>Total Attempts</p>
        </div>

        <div className="review-card">
          <h2>{averageScore.toFixed(1)} / 10</h2>
          <p>Average Score</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.student}</td>
              <td>
                {result.score} / {result.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default QuizAnalytics;