import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getAllAgreements from "~/data/getAllAgreements.server";
import DefaultCatchBoundary from "~/_common/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";

const Table = styled.table`
  border-collapse: collapse;
  text-indent: 0;
  border-width: 2px;
  border-color: #888888;
  border-style: solid;
`;

const Row = styled.tr<{ index: number }>`
  background: ${(props) => (props.index % 2 === 0 ? "#eeeeee" : "#dddddd")};
`;

const Cell = styled.td`
  padding: 12px;
`;

const Header = styled.th`
  padding: 12px;
`;

const HeaderRow = styled.tr`
  background: #dddddd;
`;

const AdminAgreementsPage = () => {
  const { agreements } =
    useLoaderData<Awaited<ReturnType<typeof getAllAgreements>>>();
  return (
    <div>
      <h1>View all of the agreements below.</h1>
      <Table>
        <thead>
          <HeaderRow>
            <Header>Type</Header>
            <Header>Status</Header>
            <Header>Creator Name</Header>
            <Header>Investor Name</Header>
            <Header>Amount</Header>
          </HeaderRow>
        </thead>
        <tbody>
          {agreements.map((a, index) => (
            <Row key={a.uuid} index={index}>
              <Cell>{a.type}</Cell>
              <Cell>{a.status}</Cell>
              <Cell>{a.userId}</Cell>
              <Cell>{a.name}</Cell>
              <Cell>${a.amount}</Cell>
            </Row>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const loader: LoaderFunction =
  createAuthenticatedLoader(getAllAgreements);

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default AdminAgreementsPage;
