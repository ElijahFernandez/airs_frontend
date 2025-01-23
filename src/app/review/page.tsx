"use client";

import React, { useState, useEffect } from 'react'

const Review = () => {
  const [interviewData, setInterviewData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch the interview data when the component mounts
    const fetchInterviewData = async () => {
      try {
        const response = await fetch('/export-data', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch interview data')
        }

        const data = await response.json()
        setInterviewData(data.interview_data)
      } catch (err) {
      }
    }

    fetchInterviewData()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Interview Review</h1>
      {interviewData ? (
        <pre>{JSON.stringify(interviewData, null, 2)}</pre>
      ) : (
        <p>Loading interview data...</p>
      )}
    </div>
  )
}

export default Review
