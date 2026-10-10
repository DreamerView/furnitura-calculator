<?php
declare(strict_types=1);
require __DIR__.'/price-categories.test.php';
function categoryChange(&$state,$a,$actor,$args){$e=PriceCategories::editor($state,$a,$actor);return PriceCategories::change($state,$a,$actor,[...$args,'revision'=>$e['revision'],'sourceRevision'=>$e['sourceRevision']]);}
$t=$s;$before=Pricing::catalog($t,$a,2)['articles']['X']['price'];
categoryChange($t,$a,$dealer,['mode'=>'rename','category'=>'A','replacement'=>'Wholesale']);
check($t['priceAssignments']['2']==='Wholesale','assignment renamed');check(Pricing::catalog($t,$a,2)['articles']['X']['price']===$before,'same effective price');check($t['priceAssignments']['1']==='A'&&$t['priceAssignments']['3']==='A','other books untouched');
$original=$t;
reject(function()use(&$t,$a,$dealer){categoryChange($t,$a,$dealer,['mode'=>'rename','category'=>'Wholesale','replacement'=>'B']);});check($original===$t,'collision is atomic');
reject(function()use(&$t,$a,$dealer){categoryChange($t,$a,$dealer,['mode'=>'delete','category'=>'Wholesale']);});check($original===$t,'delete requires explicit replacement');
categoryChange($t,$a,$dealer,['mode'=>'delete','category'=>'Wholesale','replacement'=>'B']);check($t['priceAssignments']['2']==='B','client remapped');check(!isset($t['priceBooks']['1']['prices']['X']['Wholesale']),'deleted prices removed');check(Pricing::catalog($t,$a,2)['articles']['X']['price']==121,'new category inherits supplier');
categoryChange($t,$a,$dealer,['mode'=>'delete','category'=>'B','replacement'=>null]);check(!isset($t['priceAssignments']['2']),'explicit inheritance');
$e=PriceCategories::editor($t,$a,$dealer);reject(function()use(&$t,$a,$dealer,$e){PriceCategories::change($t,$a,$dealer,['mode'=>'rename','category'=>'C','replacement'=>'New','revision'=>$e['revision']-1,'sourceRevision'=>$e['sourceRevision']]);});
foreach([['authenticated'=>false], [...$dealer,'role'=>'client'], [...$dealer,'canViewPrices'=>false]] as $actor)reject(function()use(&$t,$a,$actor){categoryChange($t,$a,$actor,['mode'=>'rename','category'=>'C','replacement'=>'New']);});
categoryChange($t,$a,$sub,['mode'=>'rename','category'=>'A','replacement'=>'Retail']);check($t['priceAssignments']['3']==='Retail','subdealer manages own clients');check($t['priceAssignments']['1']==='A','central unchanged');
echo "Category rename/delete: preservation, reassignment, explicit inheritance, collision, stale revisions and role isolation passed.\n";
