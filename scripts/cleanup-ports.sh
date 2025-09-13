#!/bin/bash

echo "🧹 Limpando processos e portas..."

# Mata processos nas portas 5173 e 5174
echo "Matando processos nas portas 5173 e 5174..."
pkill -f ":5173" || echo "Nenhum processo na porta 5173"
pkill -f ":5174" || echo "Nenhum processo na porta 5174"

# Espera um pouco para os processos serem finalizados
sleep 3

# Verifica se as portas ainda estão em uso
echo "Verificando portas..."
if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  Porta 5173 ainda está em uso"
    lsof -i :5173
else
    echo "✅ Porta 5173 está livre"
fi

if lsof -i :5174 > /dev/null 2>&1; then
    echo "⚠️  Porta 5174 ainda está em uso"
    lsof -i :5174
else
    echo "✅ Porta 5174 está livre"
fi

echo "✨ Limpeza concluída!"