//import { EventInput } from '@fullcalendar/vue3'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

// export const INITIAL_EVENTS: EventInput[] = [
//     {
//         id: createEventId(),
//         title: 'Scheduled',
//         start: "todayStr"
//         // display: 'none'        
//     }
    // {
    //     id: createEventId(),
    //     title: 'Timed event',
    //     start: todayStr + 'T12:00:00'
    // }
//]

export function createEventId() {
    return String(eventGuid++)
}
