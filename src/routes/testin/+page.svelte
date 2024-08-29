<script>
    export let events = [
      { date: '1st Jan', title: 'Evento Inicial', description: 'Descripción del evento inicial.' },
      { date: '5th Jan', title: 'Evento Secundario', description: 'Descripción del evento secundario.' },
      { date: '10th Jan', title: 'Otro Evento', description: 'Descripción de otro evento.' },
      // Agrega más eventos según sea necesario
    ];
  </script>
  
  <style>
    .timeline-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin: 2rem 0;
    }
  
    .timeline {
      position: absolute;
      height: 100%;
      width: 2px;
      background: #cbd5e1;
      top: 0;
      left: 50%;
    }
  
    .event {
      position: relative;
      width: 45%;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background: white;
      border-radius: 0.5rem;
      margin: 2rem 0;
    }
  
    .event:first-child {
      width: 90%;
      text-align: center;
      margin-right: 0;
      margin-left: 0;
    }
  
    .event:nth-child(odd):not(:first-child) {
      align-self: flex-start;
      margin-right: 55%;
      text-align: right;
    }
  
    .event:nth-child(even):not(:first-child) {
      align-self: flex-end;
      margin-left: 55%;
    }
  
    .event-date {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
    }
  </style>
  
  <div class="timeline-container">
    <div class="timeline"></div>
    {#each events as event, i}
      <div class="event">
        <div class="event-date">{event.date}</div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    {/each}
  </div>
  