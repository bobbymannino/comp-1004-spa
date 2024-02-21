# Types 2

I have been facing trouble with the speed of interaction with the events. It's also a bit complicated for my liking so to combat this i am changing the type of an event and the calendar data as a whole. I'm going to simplify it and make it smaller, this will make it easier to interact with and also easier to understand. The new type is as follows;

```js
// typedef CalendarEvent
{
    "title": string, // "Event title"
    "description": string, // "Event description"
    "id": string // "xxxxx-yyyyy-zzzzz"
    "priority": 0 | 1 | 2 | 3, // 1
    "hue": number, // 45
    "begin": string, // "2024-02-21T12:00:00"
    "end": string // "2024-02-21T15:30:00"
}
```

```js
// demo-calendar.json
{
    "events": [] // array of CalendarEvent
}
```

##### 21/02/2024
