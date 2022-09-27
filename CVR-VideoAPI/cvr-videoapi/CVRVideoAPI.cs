using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using cvr_videoapi;
using ABI_RC.Core.InteractionSystem;
using ABI_RC.VideoPlayer.Scripts;
using MelonLoader;
using UnityEngine;
using UIExpansionKit;
using ABI.CCK.Components;
using UIExpansionKit.API;
using System.Net;
using System.Security.Policy;
using System.IO;
using RTG;
using static RTG.CameraFocus;

[assembly: MelonInfo(typeof(CVRVideoAPI), "CVR Video API", "1.0.0", "ElQCduChat & Uber5001")]
[assembly: MelonGame("Alpha Blend Interactive", "ChilloutVR")]
[assembly: MelonOptionalDependencies("UIExpansionKit")]

namespace cvr_videoapi
{
    public class CVRVideoAPI: MelonMod
    {
        public const string SettingsCategory = "CVRVideoAPI";
        public static HttpListener listener;
        public static string url = "http://localhost:44913/";

        public override void OnApplicationStart()
        {
            // var category = MelonPreferences.CreateCategory(SettingsCategory, "CVR Video API");
            // var settings = ExpansionKitApi.GetSettingsCategory(CVRVideoAPI.SettingsCategory);
            // settings.AddSimpleButton("Play Video", CVRPlayVideo);

            StartWebServer();
        }

        public static void CVRPlayVideo(string Url)
        {
            try
            {
                ViewManagerVideoPlayer vp = Component.FindObjectOfType<ViewManagerVideoPlayer>();

                if (vp == null)
                {
                    MelonLogger.Warning("There is no video player in this world");
                    return;
                }

                vp.videoPlayer.SetVideoUrl(Url);
                vp.videoPlayer.Play();

            } catch (Exception e)
            {
                MelonLogger.Error("Failed to play video: " + e);
            }
        }

        public void StartWebServer()
        {
            try
            {
                // Create a Http server and start listening for incoming connections
                listener = new HttpListener();
                listener.Prefixes.Add(url);
                listener.Start();
                MelonLogger.Msg("Listening for connections on " + url);

                // Handle requests
                Task listenTask = HandleIncomingConnections();
            }
            catch (Exception e)
            {
                MelonLogger.Error("Failed to start Web Server: " + e);
            }
        }

        public async Task HandleIncomingConnections()
        {
            while (true)
            {
                try
                {
                    HttpListenerContext ctx = await listener.GetContextAsync();
                    HttpListenerRequest req = ctx.Request;
                    HttpListenerResponse resp = ctx.Response;

                    MelonLogger.Msg(req.Url.ToString());
                    MelonLogger.Msg(req.HttpMethod);
                    MelonLogger.Msg(req.UserHostName);
                    MelonLogger.Msg(req.UserAgent);
                    MelonLogger.Msg(req.Url.AbsolutePath);

                    if ((req.HttpMethod == "POST") && (req.Url.AbsolutePath.TrimEnd('/') == "/play-video"))
                    {
                        using (var reader = new StreamReader(req.InputStream, Encoding.UTF8))
                        {
                            string value = reader.ReadToEnd();

                            MelonLogger.Msg(value);

                            CVRPlayVideo(value);
                        }

                        resp.StatusCode = (int)HttpStatusCode.OK;
                        resp.StatusDescription = "OK";
                        resp.KeepAlive = false;
                        resp.ProtocolVersion = new Version("1.1");
                        resp.ContentLength64 = 0;
                        resp.AppendHeader("Access-Control-Allow-Origin", "*");
                        await resp.OutputStream.WriteAsync(new byte[] { }, 0, 0);
                    }
                    else
                    {
                        MelonLogger.Warning("Bad request, ignored.");

                        resp.StatusCode = (int)HttpStatusCode.NotFound;
                        resp.StatusDescription = "Not Found";
                        resp.KeepAlive = false;
                        resp.ProtocolVersion = new Version("1.1");
                        resp.ContentLength64 = 0;
                        await resp.OutputStream.WriteAsync(new byte[] { }, 0, 0);
                    }
                } catch (Exception e)
                {
                    MelonLogger.Error("Request failed: " + e);
                }
            }
        }
    }
}
