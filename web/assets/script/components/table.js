tableAll = new Map()
setSelected = false

function tableAllDataTable(idTable) {
    return tableAll.get(idTable).DataTable
}


jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "numeric-comma-pre": function (a) {
        var num = parseFloat(a.toString().replace(/[^\d\,\-]/g, '').replace(',', '.'))
        var sign = (a.toString().indexOf("(") >= 0) ? -1 : 1
        return num * sign
    },
    "numeric-comma-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0))
    },
    "numeric-comma-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0))
    }
})


eel.expose(setTable)
function setTable(
    self,
    idTable,
    registers,
    legend,
    selected,
    duplicates,
    invisibleCols,
    linkedTable,
    deleteButton,
    importButton,
    editButton,
    exportButton,
    editFunction,
    exportfunction,
    importFunction,
    index,
    deleteRow,
    notOrdenedColumns,
    checkColumn,
    fixedColumns,
    simpleTable,
) {
    console.log("setTable :: INIT")

    if (fixedColumns) {
        checkColumn = true
    }

    try {
        tableAll.set(
            idTable,
            {
                DataTable:
                    $("#" + idTable + "_table").DataTable({
                        // order: [[0, "desc"], [0, "asc"]],
                        order: [],
                        data: registers,
                        deferRender: true,
                        scrollX: true,
                        scrollY: 500,
                        scrollCollapse: true,
                        scroller: checkColumn,
                        autoWidth: false,
                        aLengthMenu: [
                            simpleTable?[-1]:[15, 20, 35, 50, 100, 200, -1],
                            simpleTable?['Todos']:[15, 20, 35, 50, 100, 200, 'Todos']
                        ],
                        fixedColumns: fixedColumns,
                        aoColumnDefs: [
                            // { type: "numeric-comma", aTargets: [0]},
                            { bSortable: !selected, aTargets: [0] },
                            {
                                targets: invisibleCols,
                                orderable: false,
                                visible: false
                            },
                            {
                                targets: notOrdenedColumns,
                                orderable: false, // não permite ordenação.
                            },
                            { className: "dt-head-center", targets: "_all"},
                            { className: "dt-body-center", targets: "_all"},
                            { "data": 'DT_RowIndex'}
                        ],
    
                        select: {
                            style: selected ? 'multi' : 'single',
                            toggleable: !checkColumn
                        },
                        pagingType: 'simple_numbers',
                        language: {
                            decimal: ',',
                            thousands: '.',
                            select: {
                                rows: "selec. %d"
                            },
                            lengthMenu: "_MENU_",
                            zeroRecords: "Sem Registros",
                            info: "_TOTAL_ linhas",
                            infoEmpty: "",
                            infoFiltered: "(Total: _MAX_)",
                            sLoadingRecords: "Carregando...",
                            sProcessing: "Processando...",
                            sSearch: "",
                            oPaginate: {

                                sNext: "→",
                                sPrevious: "←",
                                sFirst: "Primeiro",
                                sLast: "Ultimo"

                            },
                            sSortAscending: ": Ordenar colunas de forma ascendente",
                            sSortDescending: ": Ordenar colunas de forma descendente",
                        },
                    }),
                selected: selected,
                duplicates: duplicates,
                linkedTable: linkedTable,
                index: index,
                deleteRow:deleteRow,
            }
        )
        if (selected) {
            jQuery(function () {
                $("#" + idTable + "_table tbody").on('click', 'tr', function () {
                    $(this).toggleClass('selected')
                })
            })
        }

        let btnHTML = ""
        
        if (deleteButton && !simpleTable) {
            btnHTML +=
                `<button type="button" class="btn btn-outline-danger btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflow: hidden;" onclick="dellTableRow(${self}, '${idTable}', true, false);">
                    <i class="fa fa-trash nowrap" aria-hidden="true"></i><span class="btn-text ml-2">Deletar</span>
                </button>`
        }

        if (selected && !simpleTable) {
            btnHTML += 
            `<button type="button" class="btn btn-outline-primary btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflow: hidden;" onclick="invertSelection('${idTable}');">
                <i class="fa fa-retweet" aria-hidden="true"></i><span class="btn-text ml-2">Inverter</span>
            </button>
        <button type="button" class="btn btn-outline-primary btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflox: hidden;" onclick="clearSelection('${idTable}');">
           <i class="fa fa-eraser nowrap" aria-hidden="true"></i><span class="btn-text ml-2">Desselecionar</span>
        </button>`
        }

        if (importButton && !simpleTable) {
            btnHTML += 
            `<button type="button" class="btn btn-outline-dark btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflow: hidden;" onclick="importTable(${self}, '${idTable}', '${importFunction}');">
                <i class="fa fa-upload nowrap" aria-hidden="true"></i><span class="btn-text ml-2">Importar</span>
            </button>
            `
        }

        if (editButton && !simpleTable) {
            btnHTML += 
            `<button type="button" class="btn btn-outline-primary btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflow: hidden;" onclick="editTable(${self}, '${idTable}','${editFunction}');">
                <i class="fa fa-pencil-square nowrap" aria-hidden="true"></i><span class="btn-text ml-2">Editar</span>
            </button>
            `
        }

        if (exportButton && !simpleTable) {
            btnHTML += `<button type="button" class="btn btn-outline-success btn-sm col ml-1 mr-1 mt-1" style="max-heigh:30px; white-space: nowrap;overflow: hidden;" onclick="exportTable(${self}, '${idTable}','${exportfunction}', '${legend}');"><i class="fa fa-share nowrap" aria-hidden="true"></i><span class="btn-text ml-2">Exportar</span>
            </button>`
        }

        $(`#${idTable}_table_wrapper > div:nth-child(1)`).after(`<div class="row">${btnHTML}</div>`)
        $("#principal").addClass("principal")
        $(`#${idTable}_table_filter`).children().children().attr("placeholder", "pesquisar...")

        if (checkColumn) {
            $(`#${idTable}_table_length`).css('display', 'none')
            $(`#${idTable}_table_paginate`).css('display', 'none')
        }

        if (idTable.indexOf("_x") >= 0) {
            let width = $(`#${idTable.replace("_x", "")}Linked`).width() / 7
            $(`#${idTable}_table_filter`).children().children().css('width', width + 'px')
        } else if (idTable.indexOf("_y") >= 0) {
            let width = $(`#${idTable.replace("_y", "")}Linked`).width() / 7
            $(`#${idTable}_table_filter`).children().children().css('width', width + 'px')
        } else {
            let width = $(`#${idTable}`).width() / 4
            $(`#${idTable}_table_filter`).children().children().css('width', width + 'px')
        }
        
        if (simpleTable) {
            $(`#${idTable}_table_length`).addClass("d-none")
            // $(`#${idTable}_table_filter`).addClass("d-none")
            $(`#${idTable}_table_paginate`).addClass("d-none")
            $(`#${idTable}_table_info`).addClass("d-none")
        } else {
            $(`#${idTable}_table_paginate`).parent().removeClass("col-md-5")
            $(`#${idTable}_table_paginate`).parent().parent().addClass("row")
            $(`#${idTable}_table_paginate`).parent().removeClass("col-md-7")
            $(`#${idTable}_table_paginate`).addClass("col")
            $(`#${idTable}_table_info`).parent().removeClass("col-md-5")
            $(`#${idTable}_table_info`).addClass("col")
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust()
        }

    } catch (error) {
        console.log("setTable :: " + error)
    }
    var scrollPos = tableAllDataTable(idTable).scroller().pixelsToRow(
        $('.dataTables_scrollBody').scrollTop()
    )
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function editTableCheck(self, idTable, idRow) {
    console.log("editTableCheck :: INIT")
    let register = getTableAll(idTable, true)
    window['eel']['edit_table_check'](
        self, idTable, register, idRow
    )
}

function importTable(self, idTable, importFunction) {
    console.log("importTable :: INIT")
    window['eel'][importFunction](
        self, 
        idTable, 
        tableAll.get(idTable).selected, 
        tableAll.get(idTable).linkedTable
    )
}

function editTable(self, idTable, editFunction) {
    console.log("editTable :: INIT")
    let register = getTableAll(idTable, false, true, true)
    window['eel'][editFunction](
        self, idTable, register, tableAll.get(idTable).linkedTable
    )
}

function createTableHTML(idTable, legend, bootstrapCols) {
    console.log("createTableHTML :: INIT")
    let tableHTML = `
    <div class="col-sm-${bootstrapCols} col-12 table-responsive justify-content-center mb-5">
        <div class="col text-center">
            <h2>${legend}</h2>
        </div>
        <table id="${idTable}_table" 
        class="table table-hover table-striped 
        table-sm text-nowrap display nowrap"">
            <thead class="thead-dark">
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    `
    if ($("#" + idTable).html().indexOf(`${idTable}_table`) === -1) {
        $("#" + idTable).append(tableHTML)
    }

}

eel.expose(updateAddFormRow)
function updateAddFormRow(idTable, registers) {
    if (!tableAll.has(idTable)) {
        return
    }
    if (tableAll.get(idTable).selected) {
        let newRegister = Array()
        for (const row of registers) {
            row.unshift("")
            newRegister.push(row)
        }
        registers = newRegister
    }
    tableAllDataTable(idTable).rows.add(registers).draw().select()
}

eel.expose(createHead)
function createHead(registers, idTable, selected, legend, bootstrapCols) {
    console.log("createHead :: INIT")
    createTableHTML(idTable, legend, bootstrapCols)
    let row = ""
    if (selected) {
        row = `<th style="width: 20px!important"><input class='ml-2' type='checkbox' id='${idTable}Check' onclick='checkAll("${idTable}")'><label for='${idTable}Check'></label></th>`
    }
    else {
        row = ""
    }
    for (const item of registers) {
        row += "<th>" + item + "</th>"
    }
    $("#" + idTable + "_table thead").append("<tr>" + row + "</tr>")
}

function loadBackUpTable(self, idTable) {
    eel.load_backup_table(self, idTable, tableAll.get(idTable+"_y").index)
}

function saveBackUpTable(self, idTable) {
    eel.save_backup_table(self, idTable)
}

eel.expose(createLinkedTables)
function createLinkedTables(self, idTables, bootstrapCols) {
    // $("#" + idTables).addClass("row align-items-top justify-content-center mt-2")
    if (bootstrapCols == undefined) {
        bootstrapCols = 12
    }
    let tableXHTML = `<div id="${idTables}_x" class="col table-responsive justify-content-center"></div>`
    let tableYHTML = `<div id="${idTables}_y" class="col table-responsive justify-content-center"></div>`
    let buttonsHTML = `<div class="align-items-center justify-content-center" style="margin-top: 10%" id="${idTables}_buttons">
                        <div class="mt-1">
                            <button class="btn btn-primary fa fa-save" style="font-size:10px" onclick="saveBackUpTable(${self}, '${idTables}')" title="Recarregar todas as transações iniciais"></button>
                        </div>

                        <div class="mt-1">
                            <button class="btn btn-primary fa fa-refresh" style="font-size:10px" onclick="loadBackUpTable(${self}, '${idTables}')" title="Recarregar todas as transações iniciais"></button>
                        </div>

                        <div class="mt-3">
                            <button class="btn btn-dark fa fa-angle-right" style="width:35px;font-size:15px" title="Enviar transações selecionadas para DIREITA" onclick="switchTable(${self}, '${idTables}', 'right', false)"></button>
                        </div>

                        <div class="mt-1">
                            <button class="btn btn-dark fa fa-angle-left" style="width:35px;font-size:15px" title="Enviar transações selecionadas para ESQUERDA" onclick="switchTable(${self}, '${idTables}', 'left', false)"></button>
                        </div>

                        <div class="mt-3">
                            <button class="btn btn-dark fa fa-angle-double-right" style="width:35px;font-size:15px" title="Enviar TODAS as transações para DIREITA" onclick="switchTable(${self}, '${idTables}', 'right', true)"></button>
                        </div>

                        <div class="mt-1">
                            <button class="btn btn-dark fa fa-angle-double-left" style="width:35px;font-size:15px" title="Enviar TODAS as transações para ESQUERDA" onclick="switchTable(${self}, '${idTables}', 'left', true)"></button>
                        </div>
                </div>`
    let linkedComponent = `
                        <div class="col-sm-${bootstrapCols} col-12">
                            <div id="${idTables}Linked" class="row">
                                ${tableXHTML}
                                ${buttonsHTML}
                                ${tableYHTML}
                            </div>
                        </div>
                        `
    $("#" + idTables).append(linkedComponent)
}

eel.expose(clearLinkedTable);
function clearLinkedTable(idTable) {
    console.log("clearLinkedTable :: INIT")
    try {
        $(`#${idTable}Linked`).remove()
    } catch (error) {
        console.log('clearLinkedTable :: ' + error)
    }
}

eel.expose(clearHead);
function clearHead(idTable) {
    console.log("clearHead :: INIT")
    try {
        var elemento = document.getElementById(idTable + "_table").tHead
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild)
        }
    } catch (error) {
        console.log('clearHead :: ' + error)
    }
}

eel.expose(clearTable);
function clearTable(idTable) {
    console.log("clearTable :: INIT")
    try {
        if (tableAll.has(idTable)) {
            tableAllDataTable(idTable).clear()
            tableAllDataTable(idTable).destroy()
        }
    } catch (error) {
        console.log('clearTable :: ' + error)
    }
}

function toObject(keys, values) {
    const obj = Object.fromEntries(keys.map((key, index) => [key, values[index]]))
    return obj
}

function switchTable(self, idTable, direction, all) {
    console.log("switchTable :: INIT")


    if (!tableAll.has(idTable + "_x") && !tableAll.has(idTable + "_y")) {
        return
    }
    let idTableOrign = idTable + (direction == "right" ? "_x" : "_y")
    let idTableDest = idTable + (direction == "right" ? "_y" : "_x")
    let registers = getTableAll(idTableOrign, all, false, true)

    let deleteRow = tableAll.get(idTableOrign).deleteRow

    eel.update_linked_table(
        self,
        idTableOrign,
        removeFirstColumn(idTableOrign, registers),
        tableAll.get(idTableOrign).index,
        deleteRow,
    )
    
    if (deleteRow) {
        if (all) {
            tableAll.get(idTableOrign).DataTable
                .rows()
                .remove()
                .draw()
        } else {
            tableAll.get(idTableOrign).DataTable
                .rows({ selected: true })
                .remove()
                .draw()
        }
    }
    let ancor = direction == "right" ? '1' : '0'
    registers.forEach(element => {
        element[element.length -1] = ancor
    })

    if (tableAll.get(idTableDest).index) {

        let count_index = 0
        let length_table = tableAllDataTable(idTableDest)
                            .rows()
                            .data()
                            .toArray()
                            .length
        for (let index = 0; index < length_table; index++) {
            tableAllDataTable(idTableDest)
            .cell({row:index, column:tableAll.get(idTableDest).selected ? 1 : 0})
            .data(String(index))
            .draw()
        }

        registers = registers.map(function (row) {
            index = tableAllDataTable(idTableDest)
                    .rows()
                    .data()
                    .toArray()
                    .length
            if (index === 0 && count_index === 0){
                row[tableAll.get(idTableOrign).selected ? 1 : 0] = '0'
            } else {
                row[tableAll.get(idTableOrign).selected ? 1 : 0] = index + count_index
            }
            count_index += 1
            return row
        })

    }

    if (tableAll.get(idTableDest).selected) {
        let newRegister = Array()
        for (const row of registers) {
            row.unshift("")
            newRegister.push(row)
        }
        registers = newRegister
    } else {
        registers = removeFirstColumn(idTableOrign, registers)
    }

    if (!deleteRow || !tableAll.get(idTableDest).index) {
        tableAll.get(idTableDest).DataTable.rows.add(registers).draw().select()
    }
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

function modeOfUpdate(idTable) {
    let countSelected = tableAllDataTable(idTable).rows({ selected: true }).count()
    if (countSelected > 30000) {
        modeSelect = true
    } else {
        modeSelect = false
    }
    return modeSelect
}

function getFirstRowTable(idTable) {
    let firstRow = tableAllDataTable(idTable).rows(0).data()[0]
    if (!firstRow) {
        return
    }
    if (tableAll.get(idTable).selected) {
        firstRow = firstRow.slice(1)
    }
    return firstRow
}

eel.expose(editTableRow)
function editTableRow(idTable, registers, index) {
    if (index == undefined || index == "") {
        index = tableAllDataTable(idTable).rows({ selected: true }).indexes()[0]
    }
    if (tableAll.get(idTable).selected) {
        let newRegister = Array()
        for (const row of registers) {
            row.unshift("")
            newRegister.push(row)
        }
        registers = newRegister
    }
    var scrollPos = tableAllDataTable(idTable).scroller().pixelsToRow(
        $('.dataTables_scrollBody').scrollTop()
    )
    tableAllDataTable(idTable).row(index).data(registers[0])
    .draw().scroller.toPosition(scrollPos, false)
}

function dellTableRow(self, idTable, updateFront, all) {
    console.log("dellTableRow :: INIT")
    if (!tableAll.has(idTable)) {
        return
    }
    if (updateFront == undefined) {
        updateFront = true
    }

    let modeSelect = modeOfUpdate(idTable)
    let linkedTable = tableAll.get(idTable).linkedTable
    let selected = tableAll.get(idTable).selected
    let firstRow = getFirstRowTable(idTable)

    var scrollPos = tableAllDataTable(idTable).scroller().pixelsToRow(
        $('.dataTables_scrollBody').scrollTop()
    )

    if (modeSelect) {
        dt = getTableAll(idTable, all, true, false)
    } else {
        dt = getTableAll(idTable, all, true, true)
        if (all) {
            tableAllDataTable(idTable).rows().remove().draw().scroller.toPosition(scrollPos, false)
        } else {
            tableAllDataTable(idTable)
                .rows({ selected: true })
                .remove()
                .draw()
                .scroller
                .toPosition(scrollPos, false)
        }
    }
    eel.dell_rows(
        self,
        idTable,
        dt,
        selected,
        modeSelect,
        linkedTable,
        firstRow,
        updateFront
    )
}

function invertSelection(idTable) {
    console.log("invertSelection :: INIT")
    if (!tableAll.has(idTable)) {
        return
    }
    let rowsSelecte = tableAllDataTable(idTable).rows({ selected: false })
    tableAllDataTable(idTable).rows({ selected: true }).deselect()
    rowsSelecte.select()
}

function clearSelection(idTable) {
    console.log("clearSelection :: INIT")
    tableAllDataTable(idTable).rows().deselect()
}

function getTableAll(idTable, all, colum_selected, selected) {
    console.log("getTableAll :: INTI")
    let table = Array()
    if (all) {
        table = tableAllDataTable(idTable).rows().data().toArray()
    } else {
        table = tableAllDataTable(idTable).rows({ selected: selected }).data().toArray()
    }
    if (tableAll.get(idTable).selected && colum_selected) {
        table = removeFirstColumn(idTable, table)
    }
    return table
}

function removeFirstColumn(idTable, table) {
    if (tableAll.get(idTable).selected) {
        newTable = table.map(function (row) {
            return row.slice(1)
        })
        table = newTable
    }
    return table
}

function getHeaderAll(idTable) {
    console.log("getHeaderAll :: INIT")
    let header = tableAllDataTable(idTable).columns().header().toArray().map(x => x.innerText)
    if (tableAll.get(idTable).selected) {
        header = header.slice(1)
    }
    return header
}

function exportTable(self, idTable, exportfunction, legend) {
    if (exportfunction == 'default') {
        exportExcel(idTable, legend)
        return
    }

    window['eel'][exportfunction](
        self, idTable, legend
    )
}

function exportExcel(idTable, legend) {
    console.log("exportExcel :: INIT")
    if (!tableAll.has(idTable)) {
        return
    }
    let countSelected = tableAllDataTable(idTable).rows({ selected: true }).count()
    if (countSelected > 500000) {
        showModal(
            'excelExport',
            'Tamanho da tabela muito grande para ser exportado!',
            'exclamation-triangle',
            'Atenção'
        )
    }
    let table = getTableAll(idTable, true, true)
    let header = getHeaderAll(idTable)
    table.unshift(header)
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.aoa_to_sheet(table)
    var wscols = [];
    for (const column of header) {
        wscols.push({ wch: column.length + 5 })
    }
    ws["!cols"] = wscols
    XLSX.utils.book_append_sheet(wb, ws, "Planilha1")
    let blob = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    let fileName = (legend.replaceAll(" ", "") != "" ? legend : "dados") + ".xlsx"
    saveAs(new Blob([blob], { type: 'application/octet-stream' }), fileName)
}

function select(idTable) {
    console.log("select :: INIT")
    tableAllDataTable(idTable).rows({ page: 'current' }).select()
}

function deselect(idTable) {
    console.log("deselect :: INIT")
    tableAllDataTable(idTable).rows({ page: 'current' }).deselect()
}

function checkAll(idTable) {
    console.log('checkAll :: INIT')
    if (tableAll.has(idTable)) {
        var checkBox = document.getElementById(idTable + "Check")
        if (checkBox.checked) {
            select(idTable)
        }
        else {
            deselect(idTable)
        }
    }
    return false
}

eel.expose(checkedRadio)
function checkedRadio(idColumGroup, key) {
    $(`#${idColumGroup}_${key[0]}`).prop('checked', true)
}

eel.expose(createFormLinkedTable)
function createFormLinkedTable(self, idTable, idColumGroup, HTMLbutton) {
    console.log("createFormLinkedTable :: INIT")
    if ($("#" + idColumGroup).html().indexOf(idColumGroup) != -1) {
        return
    }
    let formLinkedHTML = `
    <form class="form-inline mt-3 border rounded">
        <div class="container-fluid form-group justify-content-between">
            <div class="form-group col-9">
                <label class="col-1 col-form-label" >Cartão:</label>
                <div class="col-3">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <input type="checkbox" class="form-check-input m-0" id="${idColumGroup}_flag" title="Selecione para capturar todas as contas">
                            </div>
                        </div>
                            <input type="text" class="form-control form-control-sm text-center" id="${idColumGroup}_input" title="Selecione para capturar todas as contas" onclick="inputNumbers('${idColumGroup}_input')" maxlength="19">
                        </div>
                    </div>
                <label class="col-1 col-form-label text-nowrap">Ciclo De:</label>
                <div class="col-1" id="${idColumGroup}_ini_cycle_content">
                    ${newSelectOption(idColumGroup + "_ini_cycle", [...Array(13).keys()], 0, 'Ciclo inicio')}
                </div>
                <label class="col-1 col-form-label">Até:</label>
                <div class="col-1" id="${idColumGroup}_end_cycle_content">
                    ${newSelectOption(idColumGroup + "_end_cycle", [...Array(13).keys()], 12, 'Ciclo fim')}
                </div>
                <div class="form-check-inline" id="${idColumGroup}_end_cycle_content">
                    <input class="ml-5" type="radio" name="${idColumGroup}_radio" id="${idColumGroup}_f"  value="fraude"  title="Cliente contesta despesas por motivo de FRAUDE"
                    onclick="eel.set_reasons(${self}, '${idTable}', 'fraude')"></input>

                    <label class="ml-2" for="${idColumGroup}_f">Fraude</label>

                    <input class="ml-2" type="radio" name="${idColumGroup}_radio" id="${idColumGroup}_c" value="controversia" title="Cliente contesta despesas por motivo de CONTROVÉRSIA"
                    onclick="eel.set_reasons(${self}, '${idTable}', 'controversia', 'controversia')"></input>

                    <label class="ml-2" for="${idColumGroup}_c">Controvérsia</label>
                </div>
            </div>
            <div class="form-group ">
                <button type="button" class="btn btn-dark btn-sm" onclick="filterLinkedTable(${self}, '${idTable}', '${idColumGroup}')">
                    <i class="fa fa-external-link-square mr-2" aria-hidden="true"></i>${HTMLbutton}
                </button>
            </div>
        </div>
    </form>`
    $("#" + idColumGroup).append(formLinkedHTML)
}

function filterLinkedTable(self, idTable, idColumGroup) {
    console.log("filterLinkedTable :: INIT")
    let groupCriteria = $('#' + idColumGroup + '_input').val()
    if (groupCriteria == undefined) {
        groupCriteria = ''
    }
    if (!validateCreditCardNumber(groupCriteria)) {
        showModal("modal", "Número de cartão inválido!", "exclamation-triangle", "Atenção")
        return
    }
    flagKey = $(`#${idColumGroup}_flag`).is(":checked")
    intCycle = $(`#${idColumGroup}_ini_cycle`).val()
    endCycle = $(`#${idColumGroup}_end_cycle`).val()
    pythonUsers(
        eel.filter_linked_table,
        ['b2k'],
        [self, idTable, groupCriteria, intCycle, endCycle, flagKey]
    )
}
