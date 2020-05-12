var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists Servicos (IdServico int unique, Descricao text, ValorPadrao double Uf text)',
		[],
		function (tx) {
			mostrarServicos();				
		},
		seDerErro);
	});	
}

function mostrarServicos() {
	novoIdServico();
	banco.transaction(function (tx) {
		tx.executeSql('select * from Servicos ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaServicos = document.getElementById('listaServicos');
			
			listaServicos.innerHTML = "";
			
			novoIdServico();
			
			var i;
			var item = null;
			
			document.getElementById('descricao').value = "";
			document.getElementById('valorPadrao').value = "";
						
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">N</th>          	 ' +
						'	<th class="">Descricao</th>                       ' +
						'	<th class="">Valor Padrão</th>               ' +
						
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				item['ValorPadrao'] = moeda(parseFloat(item['ValorPadrao']),2,'.','');		
				
				linhas = linhas + '<tr onclick="alterarServico('+item['IdServico']+')" >    ' +
								'<td class="center-align">' + item['IdServico'] +' </td>    ' +
								'<td class="">            ' + item['Descricao']+' </td>          ' +
								'<td class="">            ' + item['ValorPadrao']   +' </td>' +
								'</tr>                                                      ';
								
			}
			listaServicos.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	if (document.getElementById('descricao').value == "") {
		var $toastContent = $('<span>Preencha o Campo Descricao!</span>');
        Materialize.toast($toastContent, 5000);
		return false;			
	} else {
		return true;	
	}
}

function novoServico() {	
	novoIdServico();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idServico  = document.getElementById('idServico').value;
			var Descricao  = document.getElementById('descricao').value;
			
			var ValorPadrao      = document.getElementById('valorPadrao').value;
		
			if (ValorPadrao == "") {
				ValorPadrao = "0";				
			}
		
					
			
			Descricao = Descricao.toUpperCase();
			
			tx.executeSql('insert into Servicos (IdServico, Descricao, ValorPadrao) values (?,?,?)',
			[idServico, Descricao, ValorPadrao],
			
			function (tx) {; 
				mostrarServicos(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdServico() {
	banco.transaction(function (tx) {
		var idServico = document.getElementById('idServico');
	
	    texto = 'select MAX(IdServico) Id from Servicos'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idServico.value = item['Id'] + 1 ; 
			} else {
				idServico.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaServico() {
	var idServico   = document.getElementById('idServico').value;
	var Descricao   = document.getElementById('descricao').value;
	var ValorPadrao = document.getElementById('valorPadrao').value;
			
	
	Descricao = Descricao.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update Servicos set Descricao = ?, ValorPadrao=? where IdServico = ?', 
	[Descricao,ValorPadrao, idServico], 
	function (tx, results) {
		mostrarServicos();	
	}, 
		seDerErro);
	});
}

function excluiServico() {
	var IdServico = document.getElementById('idServico').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from Servicos where IdServico = ?', 
	[IdServico], 
	function (tx, results) {
		mostrarServicos();
		novoIdServico();		
	}, 
		seDerErro);
	});
}

function alterarServico(IdServico) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from Servicos where IdServico = ?',
		[IdServico],
		function (tx, results) {
			var item = results.rows.item(0);
			
			
			var idServico  = document.getElementById('idServico');
			var Descricao  = document.getElementById('descricao');
			var ValorPadrao = document.getElementById('valorPadrao');
			
			
			idServico.value   = IdServico;
            Descricao.value   = item['Descricao']; 
			ValorPadrao.value = item['ValorPadrao'];			
            			
            
			
		},	
		seDerErro);
	});
	
}
