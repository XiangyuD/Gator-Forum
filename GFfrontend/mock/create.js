const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


export default {
  'POST  /api/createGroup': async (req, res) => {
   
    //const { groupName, groupDescription, time } = req.params;
    await waitTime(2000);
    console.log(req.body);
    res.send({
      message: 'Ok',
    });
  },
  'POST  /api/createPost': async (req, res) => {
    res.send({
      message: 'Ok',
      postid: '123',
    });
  },
};
