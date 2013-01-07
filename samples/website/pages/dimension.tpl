<table class="table-striped table-bordered">
<tr>
<th>${model.dimension.title}</th>
<th>Quantity</th>
<tr>
<#
    for (var n in values) {
        var value = values[n];
#>
<tr>
<td>${value.name}</td>
<td>${value.count}</td>
</tr>
<#
    }
#>
</table>