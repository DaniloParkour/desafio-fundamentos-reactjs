const formatValue = (value: number): string => {
  const retorno = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  console.log(`Valor Alterado!${retorno}`);

  return retorno;
};

export default formatValue;
