var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProFacul','1.0','Sistema Para Comissoes de Formatura', 2 * 1024 * 1024);
	
	criaTabela();
	montaComboAlunos();
	montaComboCobranca();
}

function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TLancamentos (IdLancamento int unique, IdAluno int, IdCobranca int, DataReceber date, DataPagamento Date, Juros double, Valor double, ValorPago double, obs text)',
		[],
		function (tx) {
			mostrarLancamentos();				
		},
		seDerErro);
	});	
}

function mostrarLancamentos() {
	novoIdLancamento();
	banco.transaction(function (tx) {
		tx.executeSql('select a.*, b.Nome as Aluno , c.Nome as Cobranca from TLancamentos as a left join TAlunos       as b on (a.IdAluno    = b.IdAluno) ' +
					  '										                          	      left join TTipoCobranca as c on (a.IdCobranca = c.IdTipoCobranca)',
		[], 
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamentos = document.getElementById('listaLancamentos');
			
			listaLancamentos.innerHTML = "";
			
			novoIdLancamento();
			
			var i;
			var item = null;
			
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">Nº</th>        	 ' +
						'	<th class="">Aluno</th>                      ' +
						'	<th class="">Tipo Cobrança</th>              ' +
						'	<th class="">Data Receber</th>               ' +
						'	<th class="">Juros</th>                      ' +
						'	<th class="">Valor</th>                      ' +
						'	<th class="">Obs</th>                        ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				item['Valor'] = moeda(parseFloat(item['Valor']),2,'.','');
				item['Juros'] = moeda(parseFloat(item['Juros']),2,'.','');
				item['DataReceber'] = formataData(item['DataReceber']);
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >       ' +
								'<td class="center-align">' + item['IdLancamento']              +' </td>    ' +
								'<td class="">            ' + item['Aluno']                   +' </td>    ' +
								'<td class="">            ' + item['Cobranca']                +' </td>    ' +
								'<td class="">            ' + item['DataReceber']               +' </td>    ' +
								'<td class="">            ' + item['Juros']                     +' </td>    ' +
								'<td class="">            ' + item['Valor']                     +' </td>    ' +
								'<td class="">            ' + item['obs']                       +' </td>    ' +
								'</tr>                                                                      ';				  
			}
			listaLancamentos.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	return true;		
}

function novoLancamento() {	
	novoIdLancamento();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var IdLancamento = document.getElementById('idLancamento').value;
			var IdAluno      = document.getElementById('ComboAlunos').selectedIndex;
			var IdCobranca   = document.getElementById('ComboTipoCobranca').selectedIndex;
			var DataReceber  = document.getElementById('dataReceber').value;
			var Juros        = document.getElementById('juros').value;
			var Valor        = document.getElementById('valor').value;
			var Obs          = document.getElementById('obs').value;
		
			
			Obs = Obs.toUpperCase();
		
			tx.executeSql('insert into TLancamentos (IdLancamento, IdAluno, IdCobranca, DataReceber, Juros, Valor, Obs) values (?,?,?,?,?,?,?)',
			[IdLancamento, IdAluno, IdCobranca, DataReceber, Juros, Valor, Obs],
			
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
	
	    texto = 'select MAX(IdLancamento) Id from TLancamentos'
	
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
	var IdLancamento = document.getElementById('idLancamento').value;
	var IdAluno      = document.getElementById('ComboAlunos').selectedIndex;
	var IdCobranca   = document.getElementById('ComboTipoCobranca').selectedIndex;
	var DataReceber  = document.getElementById('dataReceber').value;
	var Juros        = document.getElementById('juros').value;
	var Valor        = document.getElementById('valor').value;
	var Obs          = document.getElementById('obs').value;
	
	Obs = Obs.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamentos set IdAluno = ?, IdCobranca= ?, DataReceber= ?, Juros= ?, Valor= ?, Obs = ?  where IdLancamento = ?', 
	[IdAluno, IdCobranca, DataReceber, Juros, Valor, Obs, IdLancamento], 
	function (tx, results) {
		mostrarLancamentos();	
	}, 
		seDerErro);
	});
}

function excluiLancamento() {
	var IdLancamento = document.getElementById('idLancamento').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TLancamentos where IdLancamento = ?', 
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
		tx.executeSql('select * from TLancamentos where IdLancamento = ?',
		[IdLancamento],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var IdLancamento = document.getElementById('idLancamento');
			var IdAluno      = document.getElementById('ComboAlunos');
			var IdCobranca   = document.getElementById('ComboTipoCobranca');
			var DataReceber  = document.getElementById('dataReceber');
			var Juros        = document.getElementById('juros');
			var Valor        = document.getElementById('valor');
			var Obs          = document.getElementById('obs');
	
 			IdLancamento.value= item['IdLancamento'];
			IdAluno.selectedIndex     = item['IdAluno'];     
			IdCobranca.selectedIndex  = item['IdCobranca'];  
			DataReceber.value = item['DataReceber']; 
			Juros.value       = item['Juros'];       
			Valor.value       = item['Valor'];       
			Obs.value         = item['obs'];         
            
			 
			
		},	
		seDerErro);
	});
	
}

function montaComboAlunos() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TAlunos ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var ComboAlunos = document.getElementById('listaComboAlunos');
			
			ComboAlunos.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<div class="input-field col s12">'+
						'<select class="browser-default" id="ComboAlunos"> '+
						' <option value="0"> ALUNOS </option> ';
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdAluno'] + '">' + item['Nome'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			ComboAlunos.innerHTML += cabecalho + corpo + rodape;
			
			
			},	
		seDerErro);
	});
}

function montaComboCobranca() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoCobranca ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var ComboAlunos = document.getElementById('listaComboTipoCobranca');
			
			ComboAlunos.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<div class="input-field col s12">'+
						'<select class="browser-default" id="ComboTipoCobranca">               '+
						' <option value="0"> TIPO COBRANÇA </option> ';
					
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdCobranca'] + '">' + item['Nome'] + ' </option> ';
					
			}
			
			rodape = ' </select> </div> ';
			
			ComboAlunos.innerHTML += cabecalho + corpo + rodape;
			
			
			},	
		seDerErro);
	});
}