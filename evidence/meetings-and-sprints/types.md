# Types

In this meeting we discussed how Kanban boards help the workflow of the task overall and how we can track different things we need to do. You will have 3 columns; backlog, in progress and done. this helps the flow of tasks and overall productivity. it helps track what has priority and get things done in order. whilst i'm not in a team setting when i do it will help the flow of tasks between multiple people. The first thing to do is to figure out the type of a single event and the entire calendar. This is super important as it helps with intellisense but also errors as you know what you need to create an event, update, and helps with type checking. This is as follows;

```js
// typedef CalendarEvent
{
    "title": string, // "Event title"
    "allDay": true // has to be true otherwise will have a start time and end time
    "description": string, // "Event description"
    "urgent": boolean, // false
    "color": string, // "#fff000"
    "id": string // "xxxxx-yyyyy-zzzzz"
}

// or

{
    "title": string, // "Event title"
    "startTime":  {
        hour: number, // 12
        minute: number // 0
    },
    "endTime": {
        hour: number, // 15
        minute: number // 30
    },
    "description": string, // "Event description"
    "urgent": boolean, // false
    "color": string, // "#fff000"
    "id": string // "xxxxx-yyyyy-zzzzz"
}
```

```js
// demo-calendar.json
{
    "[year]": { // 2023
        "[month]": { // 12
            "[date]": [ // 1
                [Event], [Event], [Event] // Event is a type as described above
            ]
        },
        "[month]": { // 9
            "[date]": [ // 12
                [Event], [Event], [Event] // Event is a type as described above
            ]
        }
    }
}
```

##### 29/11/2023
