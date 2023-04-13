const countDown = () => {
  const count = (date) => {
    const datems = new Date(date).getTime();
    const now = new Date().getTime();

    // ! Delta = intervalo
    const delta = datems - now;

    const sec = 1000;
    const min = 60 * sec;
    const hr = 60 * min;
    const day = 24 * hr;

    const dayNumber = Math.floor(delta / day);
    const hourNumber = Math.floor((delta % day) / hr);
    const minuteNumber = Math.floor((delta % hr) / min);
    const secondNumber = Math.floor((delta % min) / sec);

    console.log(
      `Falta \n ${
        dayNumber > 0 ? `${dayNumber} dias,` : ''
      } ${hourNumber} horas, ${minuteNumber} minutos e ${secondNumber} segundos para ${new Date(
        date
      ).toLocaleDateString('pt-br')}`
    );
  };
  count('Jan 3, 2023 00:00:00');
};

setInterval(countDown, 1000);
