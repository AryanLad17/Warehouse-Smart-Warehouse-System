#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

struct node
{
    string Name;
    int quant;
    int Location;
    node *right;
    node *left;
};

struct Edge
{
    int u, v, w;
};

struct node1
{
    int v;
    int distance;
    node1 *next;
};

class Warehouse
{
    node1 *A[5];
    int i,j;
    int parent[5];
    int w[5][5],v[5],f[5],d[5];
    vector<Edge> edges;

    int find(int i)
    {
        if (parent[i] != i)
            parent[i] = find(parent[i]);
        return parent[i];
    }

    void unite(int x, int y)
    {
        parent[x] = y;
    }

public:
    Warehouse()
    {
        for (i = 0; i < 5; i++)
        {
            A[i] = NULL;
            for (j = 0; j < 5; j++)
            {
                w[i][j] = 99;
            }
        }
    }

    node *createnode(string Nam, int Q, int locate)
    {
        node *nn = new node;
        nn->Name = Nam;
        nn->quant = Q;
        nn->Location = locate;
        nn->right = NULL;
        nn->left = NULL;
        return nn;
    }

    node *insert(node *nn, string name, int quantity, int location)
    {
        if (nn == NULL)
            return createnode(name, quantity, location);

        if (nn->Name < name)
            nn->right = insert(nn->right, name, quantity, location);
        else
            nn->left = insert(nn->left, name, quantity, location);

        return nn;
    }

    bool search(node *nn, string name)
    {
        if (nn == NULL)
            return false;

        if (name > nn->Name)
            return search(nn->right, name);
        else if (name < nn->Name)
            return search(nn->left, name);
        else if (nn->quant > 0)
            return true;
        else
            return false;
    }

    void updateadd(node *nn, string name, int quan)
    {
        if (nn == NULL)
        {
            cout << "There is no such product" << endl;
            return;
        }

        if (nn->Name < name)
            updateadd(nn->right, name, quan);
        else if (nn->Name > name)
            updateadd(nn->left, name, quan);
        else
        {
            nn->quant += quan;
            cout << "Quantity updated successfully" << endl;
        }
    }
   
void updatesub(node *nn, string name, int quan)
{
    if(nn == NULL)
    {
        cout << "There is no such product to update" << endl;
        return;
    }

    if(nn->Name < name)
        updatesub(nn->right, name, quan);
    else if(nn->Name > name)
        updatesub(nn->left, name, quan);
    else
    {
        if(nn->quant >= quan)
        {
            nn->quant -= quan;
            cout << "Quantity updated successfully" << endl;
        }
        else
        {
            cout << "Not enough quantity available" << endl;
        }
    }
}

    void add(int v1, int v2, int w)
    {
        node1 *nn = new node1;
        nn->v = v2;
        nn->distance = w;
        nn->next = NULL;

        if (A[v1] == NULL)
            A[v1] = nn;
        else
        {
            node1 *head = A[v1];
            while (head->next != NULL)
                head = head->next;
            head->next = nn;
        }
    }

    void edge(int v1, int v2, int distance)
    {
        add(v1, v2, distance);
        add(v2, v1, distance);
        edges.push_back({v1, v2, distance});
        w[v1][v2] = distance;
        w[v2][v1] = distance;
    }

    void displaylist()
    {
        for (i = 0; i < 5; i++)
        {
            cout << i << " -> ";
            node1 *head = A[i];

            while (head != NULL)
            {
                cout << "(" << head->distance << ")" << head->v << " -> ";
                head = head->next;
            }
            cout << "NULL" << endl;
        }
    }
   
    int quantity(node *nn,string name)
    {
    if(nn==NULL)
    {
    cout<<"There is no such Item to find the quantity"<<endl;
    return 0;
    }
    else if(nn->Name > name)
    return quantity(nn->left,name);
    else if(nn->Name < name)
    return quantity(nn->right,name);
    else
    return nn->quant;
    }

    int findLocation(node *nn, string name)
    {
        if (nn == NULL)
            return -1;

        if (name > nn->Name)
            return findLocation(nn->right, name);
        else if (name < nn->Name)
            return findLocation(nn->left, name);
        else
            return nn->Location;
    }

    void bfs(int start)
    {
        bool visited[5] = {false};
        queue<int> q;

        q.push(start);
        visited[start] = true;

        int count = 1;

        cout<<"\nBFS Traversal: ";

        while(!q.empty())
        {
            int u = q.front();
            q.pop();

            cout<<u<<" ";

            node1 *temp = A[u];

            while(temp != NULL)
            {
                if(!visited[temp->v])
                {
                    visited[temp->v] = true;
                    q.push(temp->v);
                    count++;
                }
                temp = temp->next;
            }
        }

        if(count == 5)
            cout<<"\nGraph is CONNECTED"<<endl;
        else
            cout<<"\nGraph is DISCONNECTED"<<endl;
    }

    void kruskalMST()
    {
        for(i = 0 ; i < 6 ; i++)
        {
            parent[i] = i;
        }     
        sort(edges.begin(), edges.end(), [](Edge a, Edge b)
        { return a.w < b.w; });

        int min_cost = 0;

        for (int i=0;i<edges.size();i++)
        {
            int u = edges[i].u;
            int v = edges[i].v;

            if (find(u) != find(v))
            {
                cout << "Edge " << u << "->" << v << " Cost :" << edges[i].w << endl;
                min_cost += edges[i].w;
                unite(find(u), find(v));
            }
        }
        cout << "Minimum cost :" << min_cost << endl;
    }

    int check()
    {
        for(i = 0 ; i < 5 ; i++)
            {
            if(v[i] == 0)
                return 0;
            }
        return 1;
    }

    void dij(int start,string name,node * head)
    {
        if(search(head,name)==true)
            {
                int destination = findLocation(head,name);    
                for(i = 0 ; i < 5 ; i++)
                {
                    v[i] = 0;
                    f[i] = -1;
                    d[i] = 99;
                }

                v[start] = 1;
                for(i = 0 ; i < 5 ; i++)
                {
                    d[i] = w[start][i];
                    f[i] = start;
                }

                    while(check()!=1)
                {
                    int min = 99;
                    int u=-1;
                    for(i = 0 ; i < 5 ; i++)
                {
                    if(v[i]==0 && min>d[i])
                    {
                        min = d[i];
                        u = i;
                    }
                }
                    v[u] = 1;

                    for(i = 0 ; i < 5 ; i++)
                {
                    if(v[i]==0 && d[i]>(w[u][i]+min))
                    {
                        d[i] = min+w[u][i];
                        f[i] = u;
                    }
                }
                }

                cout<<"Shortest distance from "<<start<<" to "<<destination<<" is:"<<d[destination]<<endl;
                int s = destination;
                while(s!=start)
                {
                    cout<<s<<"->"<<f[s]<<endl;
                    s = f[s];
                }
            }
            else
                cout<<"The Item u are searching for is not available"<<endl;
    }

    void prims(int u)
    {
        int cost = 0;
        cout<<"MST from prims:"<<endl;

        for(i = 0 ; i < 5 ; i++)
        {
            v[i] = 0;
            f[i] = -1;
            d[i] = 99;
        }

        v[u] = 1;
        for(i = 0 ; i < 5 ; i++)
        {
            d[i] = w[u][i];
            f[i] = u;
        }

        while(check()!=1)
        {
            int min = 99;
            for(i = 0 ; i < 5 ; i++)
            {
                if(v[i]==0 && min>d[i])
                {
                    min = d[i];
                    u = i;
                }
            }

            cost += min;
            v[u] = 1;
            cout<<f[u]<<"->"<<u<<" Distance:"<<d[u]<<endl;

            for(i = 0 ; i < 5 ; i++)
            {
                if(v[i]==0 && d[i]>w[u][i])
                {
                    d[i] = w[u][i];
                    f[i] = u;
                }
            }
        }
        cout<<"minimum cost using prims is:"<<cost<<endl;
    }
};
int main()
{
    Warehouse w;
    node *root = NULL;

    int choice;

    do
    {
        cout << "\n===== MENU =====" << endl;
        cout << "1. Insert Product" << endl;
        cout << "2. Search Product" << endl;
        cout << "3. Add Quantity" << endl;
        cout << "4. Reduce Quantity" << endl;
        cout << "5. Get Quantity" << endl;
        cout << "6. Add Graph Edge" << endl;
        cout << "7. Display Graph" << endl;
        cout << "8. BFS to check if the Graph is connected or not" << endl;
        cout << "9. Kruskal MST" << endl;
        cout << "10.  Prims MST" <<endl;
        cout<<  "11.  Dijkstra(To find the shortest distance to get the Item)"<<endl;
        cout << "0. Exit" << endl;

        cout << "Enter choice: ";
        cin >> choice;

        string name;
        int q, loc, u, v, dist, start;

        if(choice == 1)
        {
            cout << "Enter Name:";
            cin>>name;
            cout<<"Enter Quantity:";
            cin>>q;
            cout<<"Enter Location:";
            cin>>loc;
            if(loc>=0 && loc<=4)
                root = w.insert(root, name, q, loc);
            else
                cout<<"Entered location is invalid"<<endl;
        }
        else if(choice == 2)
        {
            cout << "Enter product name: ";
            cin >> name;
            if(w.search(root, name))
                cout << "Product Available" << endl;
            else
                cout << "Not Available" << endl;
        }
        else if(choice == 3)
        {
            cout << "Enter name:";
            cin>>name;
            cout<<"Enter Quantity: to add:";
            cin >> q;
            w.updateadd(root, name, q);
        }
        else if(choice == 4)
        {
            cout << "Enter name:";
            cin>>name;
            cout<<"Enter Quantity:";
            cin>>q;
            w.updatesub(root, name, q);
        }
        else if(choice == 5)
        {
            cout << "Enter name: ";
            cin >> name;
            cout << "Quantity: " << w.quantity(root, name) << endl;
        }
        else if(choice == 6)
        {
            int edges = 0;
            cout<<"Enter the number of edges(Must be greater than 4)):";
            cin>>edges;
            cout<<"Enter the values of vertex from 0 to 4 only:"<<endl;
            for(int i = 0 ; i < edges ; i++)
            {
                cout << "Enter u:";
                cin>>u;
                cout<<"Enter v:";
                cin>>v;
                cout<<"Enter the distance:";
                cin>>dist;
                if( u<5 && v<5 )
                    w.edge(u, v, dist);
                else
                {
                    cout<<"You are entering wrong location only location 0 to 4 are allowed"<<endl;
                    i--;
                }
        
            }

        }
        else if(choice == 7)
        {
            w.displaylist();
        }
        
        else if(choice == 8)
        {
            cout << "Enter start vertex: ";
            cin >> start;
            w.bfs(start);
        }
        
        else if(choice == 9)
        {
            w.kruskalMST();
        }

        else if(choice == 10)
        {
            w.prims(0);
        }

        else if(choice == 11)
        {
            cout<<"Enter the Name of the Product:";
            cin>>name;
            cout<<"Enter the required Quantity:";
            cin>>q;
            cout<<"Enter the starting vertex:";
            cin>>start;
            if(w.search(root,name)==1 && w.quantity(root,name)>q)
            {
                w.updatesub(root,name,q);
                w.dij(start,name,root);
            }
        }
        
        else if(choice == 0)
        {
            cout << "Exiting..." << endl;
        }
        else
        {
            cout << "Invalid choice" << endl;
        }

    } while(choice != 0);

    return 0;
}