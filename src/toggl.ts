import fetch, { Response } from 'node-fetch'

interface TimeEntry {
  data: {
    id: number
  }
}

export const startTimeEntry = async (clientSecret: string): Promise<TimeEntry> => {
  const url = `https://${clientSecret}:api_token@www.toggl.com/api/v8/time_entries/start`
  const response: Response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      "time_entry": {
        "description":"Office",
        "tags":[],
        "created_with":"curl"
      }
    })
  })
  return response.json()

}

export const getCurrentTimeEntry = async (clientSecret: string): Promise<TimeEntry> => {
  const url = `https://${clientSecret}:api_token@www.toggl.com/api/v8/time_entries/current`
  const response = await fetch(url, {
    method: 'GET'
  })
  return response.json()
}

export const stopTimeEntry = async (clientSecret: string, timeEntryId: number): Promise<Response> => {
  const url = `https://${clientSecret}:api_token@www.toggl.com/api/v8/time_entries/${timeEntryId}/stop`
  return fetch(url, {
    method: 'PUT'
  })
}
