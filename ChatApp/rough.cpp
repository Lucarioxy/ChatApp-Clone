#include<bits/stdc++.h>

using namespace std;

// check overflow ?? kaise if the number of rep is 

bool isMulOverflow(long long A, long long B) {
   if (A == 0 || B == 0)
      return false;
   long long result = A * B;
   if (A == result / B)
      return false;
   else
      return true;
}

int main(){
    int t;cin>>t;
    while(t--){
        int n,q;cin>>n>>q;
        vector<pair<int,int>> array(n);
        
    }
}