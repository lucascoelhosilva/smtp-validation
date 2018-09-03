'use strict';

const Hapi = require('hapi');
var nodemailer = require('nodemailer');

const server = Hapi.server({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT || 3000
});

const start = async function () {
    await server.register(require('inert'));

    server.route({
        method: 'POST',
        path: '/send',
        handler: function (request, h) {
            const body = request.payload;
            // O primeiro passo é configurar um transporte para este
            // e-mail, precisamos dizer qual servidor será o encarregado
            // por enviá-lo:
            var transport = nodemailer.createTransport({
                host: body.host,
                port: body.port,
                secure: true, // use TLS
                debug: true,
                auth: {
                    user: body.email,
                    pass: body.password
                }
            });

            // Após configurar o transporte chegou a hora de criar um e-mail
            // para enviarmos, para isso basta criar um objeto com algumas configurações
            var textEmail = {
                from: body.from, // Quem enviou este e-mail
                to: body.to, // Quem receberá
                subject: body.subject,  // Um assunto bacana :-) 
                html: body.html // O conteúdo do e-mail
            };

            return new Promise(function (resolve, reject) {
                transport.verify(function (error, success) {
                    if (error) {
                        var errorFormat = JSON.stringify(error);
                        resolve(errorFormat);
                    } else {
                        transport.sendMail(textEmail, function (error, response) {
                            resolve(response);
                        });
                    }
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./src/public/index.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();