var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	criaTabela();
	
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
	
	
	

	
	
	
	
	novoIdCliente();
	banco.transaction(function (tx) {
		tx.executeSql('select Cli.*, Ci.Descricao as Cidade  from Clientes as Cli LEFT JOIN Cidades as Ci on (Cli.Cidade = Ci.IdCidade) order by IdCliente desc',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaClientes = document.getElementById('listaClientes');
			
			listaClientes.innerHTML = "";
			
			novoIdCliente();
			
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

function validou() {
	
		return true;	
	
}

function novoCliente() {	
	novoIdCliente();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idCliente  = document.getElementById('idCliente').value;
			
			var	NumeroContrato  = document.getElementById('NumeroContrato').value	;
			var	RazaoSocial     = document.getElementById('RazaoSocial').value	;
			var	NomeFantasia    = document.getElementById('NomeFantasia').value	;
			var	Cidade          = document.getElementById('comboCidade').selectedIndex+1;
			var	Endereco        = document.getElementById('Endereco').value	;
			var	CpfCnpj         = document.getElementById('CpfCnpj').value	;
			var	IE              = document.getElementById('IE').value	;
			var	Cep             = document.getElementById('Cep').value	;
			var	Data            = document.getElementById('Data').value	;
			var	Email           = document.getElementById('Email').value	;
			var	TelefoneFixo    = document.getElementById('TelefoneFixo').value	;
			var	TelefoneCelular = document.getElementById('TelefoneCelular').value	;
			var	WhatsApp        = document.getElementById('WhatsApp').value	;
			var	CaminhoLogo     = document.getElementById('CaminhoLogo').value	;
			var	Obs             = document.getElementById('Obs').value	;


					
			
			
			NumeroContrato  = NumeroContrato.toUpperCase();
			RazaoSocial     = RazaoSocial.toUpperCase();
			NomeFantasia    = NomeFantasia.toUpperCase();
			//Cidade          = Cidade.toUpperCase();
			Endereco        = Endereco.toUpperCase();
			CpfCnpj         = CpfCnpj.toUpperCase();
			IE              = IE.toUpperCase();
			Cep             = Cep.toUpperCase();
			Data            = Data.toUpperCase();
			Email           = Email.toUpperCase();
			TelefoneFixo    = TelefoneFixo.toUpperCase();
			TelefoneCelular = TelefoneCelular.toUpperCase();
			WhatsApp        = WhatsApp.toUpperCase();
			CaminhoLogo     = CaminhoLogo.toUpperCase();
			Obs             = Obs.toUpperCase();
			
			
			
			tx.executeSql('insert into Clientes (IdCliente, NumeroContrato, RazaoSocial, NomeFantasia, Cidade, Endereco, CpfCnpj, IE, Cep, Data, Email, TelefoneFixo, TelefoneCelular, WhatsApp, CaminhoLogo, Obs) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
			[idCliente, NumeroContrato, RazaoSocial, NomeFantasia, Cidade, Endereco, CpfCnpj, IE, Cep, Data, Email, TelefoneFixo, TelefoneCelular, WhatsApp, CaminhoLogo, Obs],
			
			function (tx) {; 
				mostrarClientes(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdCliente() {
	banco.transaction(function (tx) {
		var idCliente = document.getElementById('idCliente');
	
	    texto = 'select MAX(IdCliente) Id from Clientes'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idCliente.value = item['Id'] + 1 ; 
			} else {
				idCliente.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaCliente() {
	var idCliente  = document.getElementById('idCliente').value;
	var	NumeroContrato  = document.getElementById('NumeroContrato').value	;
	var	RazaoSocial     = document.getElementById('RazaoSocial').value	;
	var	NomeFantasia    = document.getElementById('NomeFantasia').value	;
	var	Cidade          = document.getElementById('comboCidade').selectedIndex    + 1;
	var	Endereco        = document.getElementById('Endereco').value	;
	var	CpfCnpj         = document.getElementById('CpfCnpj').value	;
	var	IE              = document.getElementById('IE').value	;
	var	Cep             = document.getElementById('Cep').value	;
	var	Data            = document.getElementById('Data').value	;
	var	Email           = document.getElementById('Email').value	;
	var	TelefoneFixo    = document.getElementById('TelefoneFixo').value	;
	var	TelefoneCelular = document.getElementById('TelefoneCelular').value	;
	var	WhatsApp        = document.getElementById('WhatsApp').value	;
	var	CaminhoLogo     = document.getElementById('CaminhoLogo').value	;
	var	Obs             = document.getElementById('Obs').value	;		
	
	NumeroContrato  = NumeroContrato.toUpperCase();
	RazaoSocial     = RazaoSocial.toUpperCase();
	NomeFantasia    = NomeFantasia.toUpperCase();
	//Cidade          = Cidade.toUpperCase();
	Endereco        = Endereco.toUpperCase();
	CpfCnpj         = CpfCnpj.toUpperCase();
	IE              = IE.toUpperCase();
	Cep             = Cep.toUpperCase();
	Data            = Data.toUpperCase();
	Email           = Email.toUpperCase();
	TelefoneFixo    = TelefoneFixo.toUpperCase();
	TelefoneCelular = TelefoneCelular.toUpperCase();
	WhatsApp        = WhatsApp.toUpperCase();
	CaminhoLogo     = CaminhoLogo.toUpperCase();
	Obs             = Obs.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update Clientes set NumeroContrato = ?, RazaoSocial = ?, NomeFantasia = ?, Cidade = ?, Endereco = ?, CpfCnpj = ?, IE = ?, Cep = ?, Data = ?, Email = ?, TelefoneFixo = ?, TelefoneCelular = ?, WhatsApp = ?, CaminhoLogo = ?, Obs = ? where IdCliente = ?', 
	[NumeroContrato, RazaoSocial, NomeFantasia, Cidade, Endereco, CpfCnpj,IE, Cep, Data, Email, TelefoneFixo, TelefoneCelular, WhatsApp, CaminhoLogo, Obs, idCliente], 
	function (tx, results) {
		mostrarClientes();	
	}, 
		seDerErro);
	});
}

function excluiCliente() {
	var IdCliente = document.getElementById('idCliente').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from Clientes where IdCliente = ?', 
	[IdCliente], 
	function (tx, results) {
		mostrarClientes();
		novoIdCliente();		
	}, 
		seDerErro);
	});
}

function alterarCliente(IdCliente) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from Clientes where IdCliente = ?',
		[IdCliente],
		function (tx, results) {
			var item = results.rows.item(0);
			
			
			var idCliente  = document.getElementById('idCliente');
			var	NumeroContrato  = document.getElementById('NumeroContrato');  
			var	RazaoSocial     = document.getElementById('RazaoSocial');     
			var	NomeFantasia    = document.getElementById('NomeFantasia');    
			var	Cidade          = document.getElementById('comboCidade');          
			var	Endereco        = document.getElementById('Endereco');        
			var	CpfCnpj         = document.getElementById('CpfCnpj');         
			var	IE              = document.getElementById('IE');              
			var	Cep             = document.getElementById('Cep');             
			var	Data            = document.getElementById('Data');            
			var	Email           = document.getElementById('Email');           
			var	TelefoneFixo    = document.getElementById('TelefoneFixo');    
			var	TelefoneCelular = document.getElementById('TelefoneCelular'); 
			var	WhatsApp        = document.getElementById('WhatsApp');        
			var	CaminhoLogo     = document.getElementById('CaminhoLogo');     
			var	Obs             = document.getElementById('Obs');             

			
			idCliente.value       = IdCliente;
            NumeroContrato.value  = item['NumeroContrato'];
			RazaoSocial.value     = item['RazaoSocial'];
			NomeFantasia.value    = item['NomeFantasia'];
			Cidade.selectedIndex   = item['Cidade']-1;
			Endereco.value        = item['Endereco'];
			CpfCnpj.value         = item['CpfCnpj'];
			IE.value              = item['IE'];
			Cep.value             = item['Cep'];
			Data.value            = item['Data'];
			Email.value           = item['Email'];
			TelefoneFixo.value    = item['TelefoneFixo'];
			TelefoneCelular.value = item['TelefoneCelular'];
			WhatsApp.value        = item['WhatsApp'];
			CaminhoLogo.value     = item['CaminhoLogo'];
			Obs.value             = item['Obs'];

			logoGeral = CaminhoLogo.value;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			trocaLogo();
			
		},	
		seDerErro);
	});
	
}

function montaComboCidade() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from Cidades ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaCidade = document.getElementById('listaCidade');
			
			listaCidade.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select class="uppercase" id="comboCidade" name="comboCidade"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdCidade'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			listaCidade.innerHTML += cabecalho + corpo + rodape;
			
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}



function trocaLogo(){
	var Logo         = document.getElementById('logo');
	var	CaminhoLogo  = document.getElementById('CaminhoLogo');
	
	//if (CaminhoLogo.value="") {
	//	CaminhoLogo.value = logoGeral;
	//}

	
	var caminho = '../../imagensGuia/' + CaminhoLogo.value;
	
	Logo.setAttribute('src', caminho); 
	Logo.src = Logo.src;
	
}





















