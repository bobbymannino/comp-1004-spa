# Overlapping Events

In this sprint i will be implementing a feature to alert the user if they create an event while an event already exists within the new event time. In my head its quite simple;

-   when the user creates an event;
-   -   get all the events with a start time before the end time of the new event;
-   -   get all the events with an end time after the start time of the new event;
-   -   find the intersection of the two sets of events;
-   -   if the intersection is not empty, alert the user

##### 04/03/2024
