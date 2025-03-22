---
title: Хуки в GramIO - Система событий жизненного цикла бота

head:
    - - meta
      - name: "description"
        content: Обзор системы хуков в GramIO, которая позволяет подключаться к жизненному циклу API-запросов и контекста, влияя на работу бота.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, хуки, система хуков, жизненный цикл бота, onStart, onStop, onError, preRequest, onResponse, onResponseError, обработка ошибок, перехват запросов, модификация запросов, логирование запросов, мониторинг бота, события бота
---

# Хуки

Система хуков позволяет нам подключаться к жизненному циклу API-запроса/контекста и каким-то образом влиять на него.

Ниже приведены хуки, доступные в GramIO:

- [onStart](/ru/hooks/on-start) - вызывается при запуске бота
- [onStop](/ru/hooks/on-stop) - вызывается при остановке бота
- [onError](/ru/hooks/on-error) - вызывается при возникновении ошибки в контекстах
- [preRequest](/ru/hooks/pre-request) - вызывается перед отправкой запроса в Telegram Bot API (позволяет нам влиять на отправляемые параметры)
- [onResponse](/ru/hooks/on-response) - вызывается при получении ответа на API-запрос (только в случае успеха)
- [onResponseError](/ru/hooks/on-response-error) - вызывается при получении ответа на API-запрос (только в случае ошибки) 