import axios from "axios";

const getApi = () => {
  return new Promise((r) => {
    const url =
      "https://ipfs.io/ipfs/QmbX7DPUwERpTMiMYHY7ita5bV7w1Eb43xTeEHTyzN9Moh?filename=3.jpg";
    axios
      .get(url)
      .then((datas) => {
        r(datas.data);
      })
      .catch(() => {
        console.log("get model url  Data Error");
      });
  });
};

export { getApi };
