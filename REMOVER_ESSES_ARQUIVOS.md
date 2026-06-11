# Ação necessária — deletar arquivos vazios

Os dois arquivos abaixo são classes vazias geradas por template do NetBeans
e devem ser DELETADOS do repositório. O filtro real está em JwtAuthFilter.java.

## Arquivos para deletar:

```
gateway/src/main/java/gateway/main/filter/GlobalFilter.java
gateway/src/main/java/gateway/main/filter/GatewayFilterChain.java
```

## Comando Git para remover:

```bash
git rm gateway/src/main/java/gateway/main/filter/GlobalFilter.java
git rm gateway/src/main/java/gateway/main/filter/GatewayFilterChain.java
git commit -m "remove: arquivos de filtro vazios substituídos por JwtAuthFilter"
```

## O filtro correto está em:

```
gateway/src/main/java/com/workmatch/gateway/filter/JwtAuthFilter.java
```

## Verificar também o pacote da classe principal do gateway

Confirme que o arquivo principal do gateway (a classe com @SpringBootApplication)
tem o pacote com.workmatch.gateway ou superior para que o @ComponentScan
encontre JwtAuthFilter automaticamente.

Se o pacote da main class for diferente, adicione explicitamente:
@SpringBootApplication(scanBasePackages = "com.workmatch.gateway")
