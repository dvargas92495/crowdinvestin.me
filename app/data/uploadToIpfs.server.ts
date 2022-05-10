import axios from "axios";
import FormData from "form-data";

const uploadToIpfs = ({ file }: { file: Buffer }) => {
  const formData = new FormData();
  formData.append("files", file);
  const Authorization = `Basic ${Buffer.from(
    `${process.env.IPFS_INFURA_ID}:${process.env.IPFS_INFURA_SECRET}`
  ).toString("base64")}`;

  return axios
    .post<{ Hash: string }>(
      "https://ipfs.infura.io:5001/api/v0/add",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization,
        },
      }
    )
    .then((r) =>
      axios
        .post(
          `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${r.data.Hash}`,
          {},
          {
            headers: {
              Authorization,
            },
          }
        )
        .then(() => r.data.Hash)
    );
};

export default uploadToIpfs;
