<table class="table-striped table-bordered dimensions">
<#
    if (model.params.val2) {
#>
<tr>
<td><a href="/dimension?dim=${model.dimension2.name}">${model.dimension2.entity}</a></td>
<td>${model.params.val2}</td>
</tr>
<#
    }

    if (model.params.val1) {
#>
<tr>
<td><a href="/dimension?dim=${model.dimension1.name}&dim1=${model.params.dim2}&val1=${model.params.val2}">${model.dimension1.entity}</td>
<td>${model.params.val1}</td>
</tr>
<#
    }
#>
</table>

<table class="table-striped table-bordered result">
<tr>
<th>${model.dimension.title}</th>
<th>Quantity</th>
<th>Sales</th>
<th>Dimensions</th>
</tr>
<#
    for (var n in values) {
        var value = values[n];
#>
<tr>
<td>${value.name}</td>
<td>${value.quantity}</td>
<td>${value.total}</td>
<td>
<#
        if (!model.params.dim2)
            for (var m in model.dimensions) {
                var dim = model.dimensions[m];
                if (dim.name === model.params.dim1 || dim.name === model.params.dim2 || dim.name === model.dimension.name)
                    continue;            
#>
<a href="/dimension?dim=${dim.name}&dim1=${model.dimension.name}&val1=${value.name}&dim2=${model.params.dim1}&val2=${model.params.val1}">${dim.title}</a>
<#
            }
#>
</td>
</tr>
<#
    }
#>
</table>