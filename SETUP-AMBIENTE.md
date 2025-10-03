# 🔧 Configuração do Ambiente de Desenvolvimento

## Pré-requisitos Gerais

### 1. Instalar Java 21
1. Acesse https://adoptium.net/ ou https://www.oracle.com/java/technologies/downloads/
2. Baixe o Java 21 (OpenJDK ou Oracle JDK)
3. Execute o instalador seguindo as instruções padrão
4. Configure a variável de ambiente JAVA_HOME
5. Verifique a instalação:
```bash
java --version
javac --version
```

### 2. Instalar Maven
1. Acesse https://maven.apache.org/download.cgi
2. Baixe o Apache Maven
3. Extraia em uma pasta (ex: C:\Program Files\Apache\maven)
4. Configure a variável de ambiente MAVEN_HOME
5. Adicione %MAVEN_HOME%\bin ao PATH
6. Verifique a instalação:
```bash
mvn --version
```

### 3. Instalar XAMPP (MariaDB)
1. Acesse https://www.apachefriends.org/
2. Baixe e instale o XAMPP
3. Inicie o painel de controle do XAMPP
4. Inicie os serviços Apache e MySQL (MariaDB)
5. Acesse http://localhost/phpmyadmin
6. Crie o banco de dados: `db_desafio`

## Configuração da API Spring Boot

### 1. Estrutura da API
A API foi desenvolvida com as seguintes características:

#### Tecnologias Utilizadas:
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **MariaDB** - Banco de dados (via XAMPP)
- **Maven** - Gerenciamento de dependências
- **Lombok** - Redução de código boilerplate
- **SpringDoc OpenAPI** - Documentação da API (Swagger)

#### Arquitetura da API:
```
src/main/java/village/sillicon/apidemo/
├── models/           # Entidades JPA
│   ├── Pessoa.java
│   ├── Conta.java
│   └── Transacao.java
├── repositories/     # Interfaces JPA Repository
│   ├── PessoaRepository.java
│   ├── ContaRepository.java
│   └── TransacaoRepository.java
├── services/         # Lógica de negócio
│   ├── PessoaService.java
│   ├── ContaService.java
│   └── TransacaoService.java
├── controllers/      # Endpoints REST
│   ├── PessoaController.java
│   ├── ContaController.java
│   └── TransacaoController.java
└── config/          # Configurações
    └── WebConfig.java
```

### 2. Modelos de Dados

#### Pessoa.java
- `idPessoa` (int, auto-increment)
- `nome` (String, obrigatório)
- `cpf` (String, único, 11 caracteres)
- `dataNascimento` (LocalDate, obrigatório)

#### Conta.java
- `idConta` (int, auto-increment)
- `pessoa` (Pessoa, relação @ManyToOne)
- `saldo` (BigDecimal, obrigatório)
- `limiteSaqueDiario` (BigDecimal, obrigatório)
- `flagAtivo` (Boolean, padrão: true)
- `tipoConta` (int, obrigatório)
- `dataCriacao` (LocalDateTime, auto-preenchido)

#### Transacao.java
- `idTransacao` (int, auto-increment)
- `conta` (Conta, relação @ManyToOne)
- `valor` (BigDecimal, obrigatório)
- `tipoTransacao` (Enum: DEPOSITO, SAQUE, TRANSFERENCIA_ENVIADA, TRANSFERENCIA_RECEBIDA)
- `dataTransacao` (LocalDateTime, auto-preenchido)

### 3. Endpoints da API

#### PessoaController (localhost:8080/pessoas)
- `POST /criar` - Criar nova pessoa
- `GET /listar` - Listar todas as pessoas
- `GET /buscarPorId/{id}` - Buscar pessoa por ID
- `PUT /atualizar/{id}` - Atualizar pessoa
- `DELETE /deletar/{id}` - Deletar pessoa

#### ContaController (localhost:8080/contas)
- `POST /criar` - Criar nova conta
- `GET /listar` - Listar todas as contas
- `GET /buscarPorId/{id}` - Buscar conta por ID
- `PUT /atualizar/{id}` - Atualizar conta
- `DELETE /deletar/{id}` - Deletar conta

#### TransacaoController (localhost:8080/transacoes)
- `POST /saque/{id}/{valor}` - Realizar saque
- `POST /deposito/{id}/{valor}` - Realizar depósito
- `POST /transferencia/{idRecebe}/{idEnvia}/{valor}` - Realizar transferência
- `GET /listar` - Listar todas as transações
- `GET /buscarPorId/{id}` - Buscar transação por ID
- `DELETE /deletar/{id}` - Deletar transação

### 4. Operações Bancárias

#### Saque
- Recebe: ID da conta e valor
- Ação: Subtrai valor do saldo e cria transação do tipo SAQUE
- Validação: Verifica se conta está ativa e se há saldo suficiente

#### Depósito
- Recebe: ID da conta e valor
- Ação: Adiciona valor ao saldo e cria transação do tipo DEPOSITO
- Validação: Verifica se conta está ativa

#### Transferência
- Recebe: ID da conta que recebe, ID da conta que envia e valor
- Ação: 
  - Subtrai valor do saldo da conta que envia
  - Adiciona valor ao saldo da conta que recebe
  - Cria transação TRANSFERENCIA_ENVIADA para conta que envia
  - Cria transação TRANSFERENCIA_RECEBIDA para conta que recebe
- Validação: Verifica se ambas as contas estão ativas e se há saldo suficiente

### 5. Configuração do Banco de Dados

#### application.properties
```properties
spring.application.name=apidemo

# Configuração do banco MariaDB
spring.datasource.url=jdbc:mariadb://localhost:3306/db_desafio
spring.datasource.username=root
spring.datasource.password=

# Configuração JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MariaDBDialect

# Configuração CORS para frontend
spring.web.cors.allowed-origin-patterns=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### 6. Executar a API

#### Via Maven:
```bash
# Navegar para a pasta do projeto
cd apidemo

# Executar a aplicação
mvn spring-boot:run
```

#### Via IDE:
1. Abra o projeto no seu IDE (IntelliJ IDEA, Eclipse, VS Code)
2. Execute a classe `ApidemoApplication.java`
3. A aplicação estará disponível em: http://localhost:8080

#### Verificar se está funcionando:
- Acesse: http://localhost:8080/swagger-ui.html (documentação Swagger)
- Teste: http://localhost:8080/pessoas/listar

## Pré-requisitos para o Frontend React

### 4. Instalar Node.js
1. Acesse https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador seguindo as instruções padrão
4. Reinicie o terminal/prompt de comando
5. Verifique a instalação:
```bash
node --version
npm --version
```

### 2. Configurar o Backend Spring Boot
Certifique-se de que sua API Spring Boot está configurada para aceitar requisições do frontend.

#### Adicionar CORS no Spring Boot
Adicione esta anotação nos seus controllers ou configure globalmente:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

Ou configure globalmente criando uma classe de configuração:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 5. Executar o Projeto

#### 1. Preparar o Ambiente:
1. **Iniciar XAMPP:**
   - Abra o painel de controle do XAMPP
   - Inicie os serviços Apache e MySQL (MariaDB)
   - Acesse http://localhost/phpmyadmin
   - Certifique-se de que o banco `db_desafio` existe

#### 2. Backend (Spring Boot):
```bash
# Navegar para a pasta do projeto
cd apidemo

# Executar a aplicação Spring Boot
mvn spring-boot:run
```
- A API estará disponível em: http://localhost:8080
- Documentação Swagger: http://localhost:8080/swagger-ui.html

#### 3. Frontend (React):
1. Abra um terminal na pasta do projeto React
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
npm start
```
4. Acesse http://localhost:3000

## 📁 Estrutura Final do Projeto

```
apidemo/
├── src/main/java/village/sillicon/apidemo/  # API Spring Boot
│   ├── models/                    # Entidades JPA
│   │   ├── Pessoa.java
│   │   ├── Conta.java
│   │   └── Transacao.java
│   ├── repositories/              # Interfaces JPA Repository
│   │   ├── PessoaRepository.java
│   │   ├── ContaRepository.java
│   │   └── TransacaoRepository.java
│   ├── services/                  # Lógica de negócio
│   │   ├── PessoaService.java
│   │   ├── ContaService.java
│   │   └── TransacaoService.java
│   ├── controllers/               # Endpoints REST
│   │   ├── PessoaController.java
│   │   ├── ContaController.java
│   │   └── TransacaoController.java
│   ├── config/                    # Configurações
│   │   └── WebConfig.java
│   └── ApidemoApplication.java    # Classe principal
├── src/main/resources/            # Recursos da aplicação
│   ├── application.properties     # Configurações do banco
│   └── data/banco.sql            # Scripts SQL
├── src/                          # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── public/
├── package.json                  # Dependências do frontend
├── pom.xml                       # Dependências do backend
└── SETUP-AMBIENTE.md            # Este arquivo
```

## 🚀 Fluxo de Desenvolvimento

1. **Preparar o Ambiente:**
   - Iniciar XAMPP (Apache + MySQL/MariaDB)
   - Verificar se o banco `db_desafio` existe no phpMyAdmin

2. **Iniciar Backend (API Spring Boot):**
   ```bash
   cd apidemo
   mvn spring-boot:run
   ```
   - Verifique se está rodando em http://localhost:8080
   - Acesse a documentação: http://localhost:8080/swagger-ui.html
   - Teste os endpoints básicos:
     - GET http://localhost:8080/pessoas/listar
     - GET http://localhost:8080/contas/listar
     - GET http://localhost:8080/transacoes/listar

3. **Iniciar Frontend (React):**
   ```bash
   npm install
   npm start
   ```
   - Acesse http://localhost:3000

4. **Testar Funcionalidades Completas:**
   - **Gestão de Pessoas:** Cadastre uma pessoa com nome, CPF e data de nascimento
   - **Gestão de Contas:** Crie uma conta para a pessoa com saldo inicial e limite de saque
   - **Operações Bancárias:**
     - Realize um depósito
     - Faça um saque (dentro do limite)
     - Execute uma transferência entre contas
   - **Histórico:** Verifique o histórico de transações

5. **Validações Importantes:**
   - CPF deve ser único
   - Saques não podem exceder o saldo disponível
   - Transferências devem validar saldo e contas ativas
   - Todas as operações geram transações registradas

## 🛠️ Arquivos Criados

### Backend Spring Boot:
- `pom.xml` - Dependências Maven (Spring Boot, JPA, MariaDB, Lombok, Swagger)
- `src/main/resources/application.properties` - Configurações do banco e CORS
- `src/main/java/village/sillicon/apidemo/ApidemoApplication.java` - Classe principal
- `src/main/java/village/sillicon/apidemo/config/WebConfig.java` - Configuração CORS

#### Models (Entidades JPA):
- `src/main/java/village/sillicon/apidemo/models/Pessoa.java` - Entidade Pessoa
- `src/main/java/village/sillicon/apidemo/models/Conta.java` - Entidade Conta
- `src/main/java/village/sillicon/apidemo/models/Transacao.java` - Entidade Transacao

#### Repositories (Persistência):
- `src/main/java/village/sillicon/apidemo/repositories/PessoaRepository.java` - Repository JPA para Pessoa
- `src/main/java/village/sillicon/apidemo/repositories/ContaRepository.java` - Repository JPA para Conta
- `src/main/java/village/sillicon/apidemo/repositories/TransacaoRepository.java` - Repository JPA para Transacao

#### Services (Lógica de Negócio):
- `src/main/java/village/sillicon/apidemo/services/PessoaService.java` - CRUD de pessoas
- `src/main/java/village/sillicon/apidemo/services/ContaService.java` - CRUD de contas
- `src/main/java/village/sillicon/apidemo/services/TransacaoService.java` - Operações bancárias (saque, depósito, transferência)

#### Controllers (Endpoints REST):
- `src/main/java/village/sillicon/apidemo/controllers/PessoaController.java` - Endpoints para pessoas
- `src/main/java/village/sillicon/apidemo/controllers/ContaController.java` - Endpoints para contas
- `src/main/java/village/sillicon/apidemo/controllers/TransacaoController.java` - Endpoints para transações

### Frontend React:
- `package.json` - Dependências e scripts
- `public/index.html` - HTML base
- `src/index.js` - Ponto de entrada
- `src/index.css` - Estilos globais
- `src/App.js` - Componente principal com roteamento
- `src/components/Navbar.js` - Barra de navegação
- `src/services/api.js` - Configuração da API
- `src/utils/formatters.js` - Utilitários de formatação
- `src/pages/PessoasList.js` - Gerenciamento de pessoas
- `src/pages/PessoaForm.js` - Formulário de pessoa
- `src/pages/ContasList.js` - Gerenciamento de contas
- `src/pages/ContaForm.js` - Formulário de conta
- `src/pages/ContaDetails.js` - Detalhes e operações da conta

## 🎯 Próximos Passos

1. **Instalar Java 21 e Maven** (se ainda não instalados)
2. **Instalar XAMPP e configurar MariaDB**
3. **Instalar Node.js** (para o frontend)
4. **Configurar banco de dados** (`db_desafio`)
5. **Executar API Spring Boot**
6. **Executar frontend React**
7. **Testar integração completa**

## 🔍 Validação da Configuração

### 1. Verificar Backend (API):
```bash
# Verificar se a API está rodando
curl http://localhost:8080/pessoas/listar
curl http://localhost:8080/contas/listar
curl http://localhost:8080/transacoes/listar

# Acessar documentação Swagger
http://localhost:8080/swagger-ui.html
```

### 2. Verificar Frontend:
- Acesse http://localhost:3000
- Navegue entre "Pessoas" e "Contas"
- Teste CRUD de pessoas e contas
- Teste operações bancárias (depósito, saque, transferência)

### 3. Testar Operações Bancárias:
```bash
# Criar uma pessoa
POST http://localhost:8080/pessoas/criar
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "dataNascimento": "1990-01-01"
}

# Criar uma conta
POST http://localhost:8080/contas/criar
{
  "pessoa": {"idPessoa": 1},
  "saldo": 1000.00,
  "limiteSaqueDiario": 500.00,
  "flagAtivo": true,
  "tipoConta": 1
}

# Realizar depósito
POST http://localhost:8080/transacoes/deposito/1/100.50

# Realizar saque
POST http://localhost:8080/transacoes/saque/1/50.00

# Verificar histórico
GET http://localhost:8080/transacoes/listar
```

## 🐛 Problemas Comuns

### Problemas com Java/Maven:
- **"java não é reconhecido"**
  - Java não está instalado ou não está no PATH
  - Solução: Instalar Java 21 e configurar JAVA_HOME

- **"mvn não é reconhecido"**
  - Maven não está instalado ou não está no PATH
  - Solução: Instalar Maven e configurar MAVEN_HOME

### Problemas com Banco de Dados:
- **"Connection refused" ou erro de conexão com MariaDB**
  - XAMPP não está rodando ou MariaDB não foi iniciado
  - Solução: Iniciar XAMPP e verificar se MySQL/MariaDB está ativo

- **"Database 'db_desafio' doesn't exist"**
  - Banco de dados não foi criado
  - Solução: Acessar phpMyAdmin e criar o banco `db_desafio`

- **"Access denied for user 'root'"**
  - Credenciais incorretas no application.properties
  - Solução: Verificar username/password no XAMPP

### Problemas com Frontend:
- **"npm não é reconhecido"**
  - Node.js não está instalado ou não está no PATH
  - Solução: Instalar Node.js e reiniciar o terminal

### Problemas de Integração:
- **"Erro de CORS"**
  - Backend não está configurado para aceitar requisições do frontend
  - Solução: Verificar configuração CORS no application.properties

- **"Erro de conexão com API"**
  - Backend não está rodando ou está em porta diferente
  - Solução: Verificar se Spring Boot está em http://localhost:8080

- **"Erro ao criar conta/pessoa"**
  - Banco de dados não configurado ou API com erro
  - Solução: Verificar logs do Spring Boot e configuração do BD

### Problemas Específicos da API:
- **"Failed to configure a DataSource"**
  - Problema de conexão com o banco de dados
  - Solução: Verificar se XAMPP está rodando e se o banco existe

- **"Table doesn't exist"**
  - Tabelas não foram criadas pelo Hibernate
  - Solução: Verificar se `spring.jpa.hibernate.ddl-auto=update` está configurado

- **"CPF já existe"**
  - Tentativa de criar pessoa com CPF duplicado
  - Solução: Verificar se CPF já está cadastrado ou usar CPF diferente


