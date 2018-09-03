FROM node:8

# use nodemon for development
RUN npm install --global nodemon

# add project files
WORKDIR /app
ADD . /app

EXPOSE 3000

CMD ["nodemon", "--inspect=5858"]