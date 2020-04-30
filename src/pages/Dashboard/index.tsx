import React, { useState, useEffect } from 'react';

import { networkInterfaces } from 'os';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface ResponseTransaction {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  created_at: Date;
  updated_at: Date;
  category: {
    id: string | null;
    title: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };
}

interface RequestBalance {
  transactions: ResponseTransaction[];
  balance: {
    income: string;
    outcome: string;
    total: string;
  };
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  createdAt: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function formatCurrency(value: number): string {
    console.log(value);

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    console.log(formattedValue);

    return formattedValue;
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      console.log('INICIADO!');
      const response = await api.get<RequestBalance>('/transactions');

      console.log(`CONTEUDO RECEBIDO! ${response}`);

      if (!response) return;

      const respTransac = response.data.transactions;
      const respBalance: Balance = {
        income: formatCurrency(Number(response.data.balance.income)),
        outcome: formatCurrency(Number(response.data.balance.outcome)),
        total: formatCurrency(Number(response.data.balance.total)),
      };

      setBalance(respBalance);

      const newTransac: Transaction[] = [];

      respTransac.map(transac => {
        const valueFormmated = new Intl.NumberFormat('br-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(transac.value * (transac.type === 'income' ? 1 : -1)));

        const dateFormated = new Intl.DateTimeFormat('pt-BR').format(
          new Date(transac.created_at),
        );

        const categ = transac.category
          ? `${transac.category.title}`
          : 'Sem categoria';

        newTransac.push({
          id: transac.id,
          title: transac.title,
          value: transac.value,
          formattedValue: valueFormmated,
          formattedDate: dateFormated,
          // formattedDate: 'FaltaFormatarAData',
          type: transac.type,
          createdAt: transac.created_at,
          category: {
            title: categ,
          },
        });

        return newTransac;
      });

      // setTransactions([...transactions, newTransac]);
      setTransactions(newTransac);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
