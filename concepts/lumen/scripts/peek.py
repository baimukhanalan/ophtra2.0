import json,sys
d=json.load(open('scripts/all.json'))
def show(v,ind=0,maxs=90):
  p='  '*ind
  if isinstance(v,dict):
    for k,x in v.items():
      if isinstance(x,(dict,list)): print(p+k+':'); show(x,ind+1,maxs)
      else: print(p+k+': '+str(x)[:maxs])
  elif isinstance(v,list):
    if v and all(not isinstance(i,(dict,list)) for i in v): print(p+'['+' | '.join(str(i)[:50] for i in v[:6])+']'+(' +%d'%(len(v)-6) if len(v)>6 else ''))
    else:
      for i in v[:int(sys.argv[2]) if len(sys.argv)>2 else 2]: print(p+'-'); show(i,ind+1,maxs)
      if len(v)>2: print(p+'... %d items'%len(v))
  else: print(p+str(v)[:maxs])
for path in sys.argv[1].split(','):
  x=d
  for k in path.split('.'): x=x[k]
  print('#####',path); show(x)
