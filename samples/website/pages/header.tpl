<html><head><title>
Simple Memolap Web Site Sample: ${model.title}
</title>
<link rel="stylesheet" href="/css/bootstrap.css">
<link rel="stylesheet" href="/css/styles.css">
</head>
<body>

<div class="navbar">
<div class="navbar-inner">
<div class="container">
<div class="nav">
<ul class="nav">

<li>
<a href="/">Home</a>
</li>
<li class="dropdown">
<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dimensions<b class="caret"></b></a>
<ul class="dropdown-menu">
<#
    for (var n in dimensions) {
        var dimension = dimensions[n];
#>
    <li>
    <a href="/dimension?dim=${ dimension.name }">${ dimension.title }</a>
    </li>
<#
    }
#>
</ul>
</li>

</ul>
</div>
</div>
</div>
</div>

<div class="content">
        
<h1>${ model.title }</h1>
