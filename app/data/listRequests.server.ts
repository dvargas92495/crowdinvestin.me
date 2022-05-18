import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import STAGES from "../../app/enums/contract_stages";
import getEversign from "./eversign.server";
import verifyAdminUser from "./verifyAdminUser.server";

const regions = [
  "eu-north-1",
  "ap-south-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "ca-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
];

const getAllAgreements = (userId: string) =>
  verifyAdminUser(userId)
    .then(() => import("aws-sdk"))
    .then((aws) => {
      const cw = new aws.default.CloudWatchLogs();
      return Promise.all(
        regions.map((r) =>
          cw
            .describeLogGroups({
              logGroupNamePrefix: `/aws/lambda/${r}.${process.env.ORIGIN?.replace(
                /\./,
                "-"
              )}`,
            })
            .promise()
            .then((lg) => lg.logGroups || [])
        )
      )
        .then((groups) => groups.flat())
        .then((groups) =>
          Promise.all(
            groups.map((g) =>
              cw
                .describeLogStreams({ logGroupName: g.logGroupName || "" })
                .promise()
                .then((r) => r.logStreams || [])
            )
          ).then((streams) => streams.flat())
        )
        .then((streams) => ({ streams }));
    });

export default getAllAgreements;
