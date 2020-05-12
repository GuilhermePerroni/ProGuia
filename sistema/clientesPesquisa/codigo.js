var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	//criaTabela();
	
	var logoGeral = "";
	
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists Clientes (IdCliente Int unique, NumeroContrato Int, RazaoSocial Text, NomeFantasia Text, Cidade Int, Endereco Text, CpfCnpj Text, IE Text, Cep Text, Data Date, Email Text, TelefoneFixo	Text, TelefoneCelular Text, WhatsApp Text,CaminhoLogo Text, Obs	Text)',
		
		
		[],
		function (tx) {

			mostrarClientes();				
		},
		seDerErro);
	});	
	
	
	montaComboCidade();
}

function mostrarClientes() {

	banco.transaction(function (tx) {
		
		Where = document.getElementById('PesquisaCliente').value;
		Where = 'WHERE Cli.RazaoSocial LIKE "%'+Where+'%" or Cli.NomeFantasia LIKE "%'+Where+'%" order by IdCliente desc';
		//Where = Where;
		
		tx.executeSql('select Cli.*, Ci.Descricao as Cidade  from Clientes as Cli LEFT JOIN Cidades as Ci on (Cli.Cidade = Ci.IdCidade) ' +
					  Where,
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaClientes = document.getElementById('listaClientes');
			
			listaClientes.innerHTML = "";
			
			
			var i;
			var item = null;
			

				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">N</th>        	  ' +
						
						'	<th class="">N Contrato</th>                   ' +
						'	<th class="">Razao Social</th>                   ' +
						'	<th class="">Nome Fantasia</th>                   ' +
						'	<th class="">Cidade</th>                   ' +
						'	<th class="">Endereco</th>                   ' +
						'	<th class="">Cpf/Cnpj</th>                   ' +
						'	<th class="">IE</th>                       ' +
						'	<th class="">Cep</th>                      ' +
						'	<th class="">Data</th>                     ' +
						'	<th class="">E-mail</th>                    ' +
						'	<th class="">Telefone Fixo</th>             ' +
						'	<th class="">Celular</th>          ' +
						'	<th class="">WhatsApp</th>                 ' +
						'	<th class="">Logo</th>                       ' +
						'	<th class="">Obs</th>                       ' +
						
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
						
				
				linhas = linhas + '<tr onclick="alterarCliente('+item['IdCliente']+')" > ' +
								'<td class="center-align">' + item['IdCliente'] +' </td>  ' +
								
								'<td class="">            ' + item['NumeroContrato']  +' </td>         ' +
								'<td class="">            ' + item['RazaoSocial']     +' </td>         ' +
								'<td class="">            ' + item['NomeFantasia']    +' </td>         ' +
								'<td class="">            ' + item['Cidade']          +' </td>         ' +
								'<td class="">            ' + item['Endereco']        +' </td>         ' +
								'<td class="">            ' + item['CpfCnpj']         +' </td>         ' +
								'<td class="">            ' + item['IE']              +' </td>         ' +
								'<td class="">            ' + item['Cep']             +' </td>         ' +
								'<td class="">            ' + item['Data']            +' </td>         ' +
								'<td class="">            ' + item['Email']           +' </td>         ' +
								'<td class="">            ' + item['TelefoneFixo']    +' </td>         ' +
								'<td class="">            ' + item['TelefoneCelular'] +' </td>         ' +
								'<td class="">            ' + item['WhatsApp']        +' </td>         ' +
								'<td class="">            ' + item['CaminhoLogo']     +' </td>         ' +
								'<td class="">            ' + item['Obs']             +' </td>         ' +

								
								'</tr>                                                     ';				  
			}
			listaClientes.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}






















