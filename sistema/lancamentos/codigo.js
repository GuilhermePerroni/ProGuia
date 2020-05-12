var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists Lancamentos (IdLancamento int unique, IdCliente Int, IdVendedor Int, IdServico Int, Descricao	Text, Obs Text, Valor Double, ComissaoPaga	Text)',
		[],
		function (tx) {
			mostrarLancamentos();				
		},
		seDerErro);
	});	
	montaComboCliente();
	montaComboServico();
	montaComboVendedor();
}

function mostrarLancamentos() {
	novoIdLancamento();
	banco.transaction(function (tx) {
		
	
		tx.executeSql('select Lan.*, Cli.RazaoSocial ||" / "|| Cli.NomeFantasia as Cliente, Ser.Descricao as Servico, Ven.Nome as Vendedor from Lancamentos Lan 	'+
					  'left join Clientes as Cli on (Lan.IdCliente = Cli.IdCliente) '+
					  'left join Servicos as Ser on (Lan.IdServico = Ser.IdServico) ' +
					  'left join Vendedores as Ven on (Lan.IdVendedor = Ven.IdVendedor)',	
		
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamentos = document.getElementById('listaLancamentos');
			
			listaLancamentos.innerHTML = "";
			
			novoIdLancamento();
			
			var i;
			var item = null;
			
			document.getElementById('Descricao').value = "";
						
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">N</th>        	 ' +
						'	<th class="">Cliente</th>                       ' +
						'	<th class="">Vendedor</th>                       ' +
						'	<th class="">Servico</th>                       ' +
						'	<th class="">Descricao</th>                       ' +
						'	<th class="">Obs</th>                       ' +
						'	<th class="">Valor</th>                       ' +
						'	<th class="">ComissaoPaga</th>                       ' +
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
						
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" > ' +
								'<td class="center-align">' + item['IdLancamento'] +' </td>  ' +
								'<td class="">            ' + item['Cliente']+' </td>         ' +
								'<td class="">            ' + item['Vendedor']+' </td>         ' +
								'<td class="">            ' + item['Servico']+' </td>         ' +
								'<td class="">            ' + item['Descricao']+' </td>         ' +
								'<td class="">            ' + item['Obs']+' </td>         ' +
								'<td class="">            ' + item['Valor']+' </td>         ' +
								'<td class="">            ' + item['ComissaoPaga']+' </td>         ' +
								'</tr>                                                     ';				  
			}
			listaLancamentos.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	if (document.getElementById('Descricao').value == "") {
		var $toastContent = $('<span>Preencha o Campo Nome!</span>');
        Materialize.toast($toastContent, 5000);
		return false;			
	} else {
		return true;	
	}
}

function novoLancamento() {	
	novoIdLancamento();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idLancamento  = document.getElementById('idLancamento').value;
			var IdVendedor = document.getElementById('comboVendedor').selectedIndex    + 1;
			var IdCliente = document.getElementById('comboCliente').selectedIndex    + 1;
			var IdServico = document.getElementById('comboServico').selectedIndex    + 1;
			var Descricao = document.getElementById('Descricao').value;
			var Obs = document.getElementById('Obs').value;
			var Valor = document.getElementById('Valor').value;
			//var ComissaoPaga = document.getElementById('ComissaoPaga').value;
			
			
					
			
			Descricao = Descricao.toUpperCase();
			Obs = Obs.toUpperCase();
			
			tx.executeSql('insert into Lancamentos (IdLancamento, IdVendedor, IdCliente, IdServico, Descricao, Obs, Valor) values (?,?,?,?,?,?,?)',
			[idLancamento, IdVendedor, IdCliente, IdServico, Descricao, Obs, Valor],
			
			function (tx) {; 
				mostrarLancamentos(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdLancamento() {
	banco.transaction(function (tx) {
		var idLancamento = document.getElementById('idLancamento');
	
	    texto = 'select MAX(IdLancamento) Id from Lancamentos'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idLancamento.value = item['Id'] + 1 ; 
			} else {
				idLancamento.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaLancamento() {
	var idLancamento  = document.getElementById('idLancamento').value;
	var IdVendedor = document.getElementById('comboVendedor').selectedIndex    + 1;
	var IdCliente = document.getElementById('comboCliente').selectedIndex    + 1;
	var IdServico = document.getElementById('comboServico').selectedIndex    + 1;
	var Descricao = document.getElementById('Descricao').value;
	var Obs = document.getElementById('Obs').value;
	var Valor = document.getElementById('Valor').value;
	//var ComissaoPaga = document.getElementById('ComissaoPaga').value;
	
	Descricao = Descricao.toUpperCase();
	Obs = Obs.toUpperCase();
	
	
	
	
	banco.transaction(function (tx) {
	tx.executeSql(' update Lancamentos set IdVendedor = ?, IdCliente = ?, IdServico = ?, Descricao = ?, Obs = ?, Valor = ?  where IdLancamento = ?', 
	[IdVendedor, IdCliente, IdServico, Descricao, Obs, Valor, idLancamento], 
	function (tx, results) {
		mostrarLancamentos();	
	}, 
		seDerErro);
	});
}

function excluiLancamento() {
	var IdLancamento = document.getElementById('idLancamento').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from Lancamentos where IdLancamento = ?', 
	[IdLancamento], 
	function (tx, results) {
		mostrarLancamentos();
		novoIdLancamento();		
	}, 
		seDerErro);
	});
}

function alterarLancamento(IdLancamento) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from Lancamentos where IdLancamento = ?',
		[IdLancamento],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var idLancamento = document.getElementById('idLancamento');
			
			var IdVendedor   = document.getElementById('comboVendedor');
			var IdCliente    = document.getElementById('comboCliente');
			var IdServico    = document.getElementById('comboServico');
			var Descricao    = document.getElementById('Descricao');
			var Obs          = document.getElementById('Obs');
			var Valor        = document.getElementById('Valor');

			
			idLancamento.value = IdLancamento;
			
			IdVendedor.selectedIndex = item['IdVendedor']-1;
			IdCliente.selectedIndex = item['IdCliente']-1;
			IdServico.selectedIndex = item['IdServico']-1;
			Descricao.value = item['Descricao'];
			Obs.value = item['Obs'];
			Valor.value = item['Valor'];
			
			
			
		},	
		seDerErro);
	});
	
}

function montaComboVendedor() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from Vendedores ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaVendedor = document.getElementById('listaVendedor');
			
			listaVendedor.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<label for="comboVendedor"> Vendedores </label> <div class="input-field col s12">'+
						'<select class="uppercase" id="comboVendedor" name="comboVendedor"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdVendedor'] + '">' + item['Nome'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			listaVendedor.innerHTML += cabecalho + corpo + rodape;
			
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}


function montaComboCliente() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from Clientes ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaCliente = document.getElementById('listaCliente');
			
			listaCliente.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<label for="comboCliente"> Clientes </label> <div class="input-field col s12">'+
						'<select class="uppercase" id="comboCliente" name="comboCliente"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdCliente'] + '">' + item['RazaoSocial'] +" / "+  item['NomeFantasia'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			listaCliente.innerHTML += cabecalho + corpo + rodape;
			
			
			
			
			},	
		seDerErro);
	});
}

function montaComboServico() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from Servicos ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaServico = document.getElementById('listaServico');
			
			listaServico.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<label for="comboServico"> Serviços </label> <div class="input-field col s12">'+
						'<select onchange="colocaValorPadrao()" class="uppercase" id="comboServico" name="comboServico"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			listaServico.innerHTML += cabecalho + corpo + rodape;
			
			
			
			},	
		seDerErro);
	});
}

function colocaValorPadrao(){
	var cod = document.getElementById('comboServico').selectedIndex+1;
	
	banco.transaction(function (tx) {
		tx.executeSql('select ValorPadrao from Servicos where IdServico = ? ',
		[cod],
		function (tx, results) {
			var item = null;
			item = results.rows.item(0);
			
			Valor = document.getElementById('Valor');
			
			//Valor.value = moeda(parseFloat(item['ValorPadrao']),2,'.','');
			Valor.value = item['ValorPadrao'];//moeda(parseFloat(item['Valor']),2,'.','');
			
			},	
		seDerErro);
	});
}