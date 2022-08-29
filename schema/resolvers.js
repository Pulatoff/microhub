const resolvers = {
  Query: {
    users: () => {
      return [
        {
          id: 1,
          login: "Niyozbek",
          password: "niyozbekpu$lat#24440#*@",
          name: "Niyozbek",
          email: "niyozbekpulatov@gmail.com",
          phone: "+998995490312",
          role: "Consumer",
          photo: "default.jpg",
        },
      ];
    },
  },
};

module.exports = { resolvers };
